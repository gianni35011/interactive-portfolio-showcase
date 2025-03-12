import {
    AdditiveBlending,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Object3D,
    PointLight,
    PointLightHelper,
    Points, PointsMaterial,
    Scene, ShaderMaterial, TextureLoader,
    Vector3
} from "three";

import fireTexture from '/public/assets/world/fire-particle.png';

export default class Fire extends Object3D {
    private readonly fireLight: PointLight;
    private readonly pointLightHelper: PointLightHelper;

    private time: number= 0;
    private baseIntensity: number = 2;
    private baseColour: Color = new Color(0xffa500);

    private flickerSpeed: number = 0.1;
    private intensityVariation: number = 0.1;
    private positionVariation: number = 0.1;
    private colourVariation: number = 0.1;
    private distanceVariation: number = 1.0;

    private particles: Points;
    private particleCount: number = 250;
    private particlePositions: number[] = [];
    private particleVelocities: Vector3[] = [];
    private particleLifespans: number[] = [];
    private particleMaxLifespan: number = 3;

    private fireSize: number = .5;


    constructor(x: number,y: number,z: number) {
        super();
        this.fireLight = new PointLight(this.baseColour, this.baseIntensity, 10);
        this.fireLight.position.set(0,0,0);
        this.add(this.fireLight);

        this.pointLightHelper = new PointLightHelper(this.fireLight);
        this.position.set(x, y, z);


        this.particles = this.initializeParticles();
        this.add(this.particles);
    }

    addHelperToScene(scene: Scene) {
        //scene.add(this.pointLightHelper);
    }

    update(dt: number){
        this.time += dt;
        this.animateFire();
        this.updateParticles(dt);
    }

    animateFire():void{

        const noise = (
            Math.sin(this.time * 10 * this.flickerSpeed) * 0.5 +
            Math.sin(this.time * 17 * this.flickerSpeed) * 0.3 +
            Math.sin(this.time * 31 * this.flickerSpeed) * 0.2
        );

        // Make fire 'flare up' randomly
        const intensitySpike = Math.random() < 0.05 ? Math.random() * 2.0 : 0;

        this.fireLight.intensity = this.baseIntensity + noise * this.intensityVariation + intensitySpike;

        const posVariation = Math.sin(this.time * 7) * this.positionVariation;
        this.fireLight.position.x = posVariation;
        this.fireLight.position.y = posVariation;
        this.fireLight.position.z = posVariation;

        this.fireLight.distance = 10 + noise * this.distanceVariation;

        const h = 0.08 + noise * 0.05 * this.colourVariation;
        const s = 0.7 + noise * 0.3 * this.colourVariation;
        const l = 0.5 + noise * 0.2 * this.colourVariation;

        this.fireLight.color.setHSL(h, s, l);
        this.pointLightHelper.update()

    }

    private initializeParticles(): Points {
        // Create geometry for particles
        const geometry = new BufferGeometry();

        // Arrays to store particle properties
        this.particlePositions = [];
        this.particleVelocities = [];
        this.particleLifespans = [];

        // Initialize particle positions and properties
        for (let i = 0; i < this.particleCount; i++) {
            // Random position within a small radius around the fire center
            this.particlePositions.push(
                (Math.random() - 0.5) * 0.5 * this.fireSize,  // x
                (Math.random() - 0.5) * 0.2 * this.fireSize,  // y
                (Math.random() - 0.5) * 0.5 * this.fireSize   // z
            );

            // Velocity vector - mostly upward with some randomness
            this.particleVelocities.push(new Vector3(
                (Math.random() - 0.5) * 0.3 * this.fireSize,
                Math.random() * 0.5 + 0.5 * this.fireSize,
                (Math.random() - 0.5) * 0.3 * this.fireSize
            ));

            this.particleLifespans.push((i / this.particleCount) * this.particleMaxLifespan);
        }

        // Add attributes to geometry
        geometry.setAttribute('position', new Float32BufferAttribute(this.particlePositions, 3));

        // Particle color and size arrays
        const colors = [];
        const sizes = [];
        const lives = [];

        for (let i = 0; i < this.particleCount; i++) {
            // Colors - yellow to red gradient
            colors.push(1.0, 0.6, 0.0); // Orange base color

            // Random size between 0.1 and 0.3
            sizes.push(Math.random() * 0.2 + 0.1);

            lives.push(this.particleLifespans[i]);
        }

        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('life', new Float32BufferAttribute(lives, 1));

        // Load a fire particle texture
        const textureLoader = new TextureLoader();
        const particleTexture = textureLoader.load(fireTexture);  // You'll need to create this texture

        // Custom vertex shader for particle animation
        const vertexShader = `
            attribute float size;
            attribute vec3 color;
            attribute float life;
            
            varying vec3 vColor;
            varying float vLife;
            
            void main() {
                vColor = color;
                vLife = life / ${this.particleMaxLifespan.toFixed(1)};
                
                // Standard point size calculations
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Custom fragment shader for particle appearance
        const fragmentShader = `
            uniform sampler2D pointTexture;
            
            varying vec3 vColor;
            varying float vLife;
            
            void main() {
                // Sample the texture
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                
                // Adjust the alpha based on the particle life and texture alpha
                float alpha = texColor.a * (1.0 - vLife);
                
                // Shift the color from yellow to orange to red as the particle ages
                vec3 finalColor = vColor;
                finalColor.g *= max(0.0, 1.0 - vLife * 1.5);
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `;

        // Create shader material
        const material = new ShaderMaterial({
            uniforms: {
                pointTexture: { value: particleTexture }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            blending: AdditiveBlending,
            depthWrite: false,
            transparent: true
        });

        return new Points(geometry, material);
    }

    updateParticles(deltaTime: number): void {
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        const lives = this.particles.geometry.attributes.life.array;

        for (let i = 0; i < this.particleCount; i++) {
            // Update lifespan
            this.particleLifespans[i] += deltaTime;

            // If particle is too old, reset it
            if (this.particleLifespans[i] > this.particleMaxLifespan) {
                this.resetParticle(i);
                continue;
            }

            const idx = i * 3;

            // Calculate life percentage
            const lifePercent = this.particleLifespans[i] / this.particleMaxLifespan;
            lives[i] = this.particleLifespans[i];

            // Update position based on velocity
            positions[idx]     += this.particleVelocities[i].x * deltaTime;
            positions[idx + 1] += this.particleVelocities[i].y * deltaTime;
            positions[idx + 2] += this.particleVelocities[i].z * deltaTime;

            // Add some turbulence based on position
            const turbulenceScale = 0.01 * this.fireSize;
            positions[idx]     += (Math.sin(positions[idx + 1] * 10 + this.time) * 0.01 * turbulenceScale);
            positions[idx + 2] += (Math.cos(positions[idx + 1] * 10 + this.time) * 0.01) * turbulenceScale;

            // Color transition from yellow to red to transparent
            colors[idx]     = 1.0; // R (keep red constant)
            colors[idx + 1] = Math.max(0.6 - lifePercent * 0.6, 0); // G (decreases)
            colors[idx + 2] = Math.max(0.1 - lifePercent * 0.1, 0); // B (decreases)

            // Size first increases then decreases with smoother transition
            let sizeScale = 3.0;

            if (lifePercent < 0.3) {
                sizeScale = lifePercent * sizeScale / 0.3;
            } else {
                const fadePercent = (lifePercent - 0.3) / 0.7;
                // Smoother fade out using easing function
                sizeScale = 1.0 - (fadePercent * fadePercent);
            }

            // Apply size with fire size scaling
            sizes[i] = (Math.random() * 0.2 + 0.1) * sizeScale * this.fireSize;
        }

        // Update attributes
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        this.particles.geometry.attributes.life.needsUpdate = true;
    }

    resetParticle(index: number): void {
        const idx = index * 3;

        // Reset position to near the base of the fire
        this.particles.geometry.attributes.position.array[idx] = (Math.random() - 0.5) * 0.5 * this.fireSize;
        this.particles.geometry.attributes.position.array[idx + 1] = (Math.random() - 0.5) * 0.2 * this.fireSize;
        this.particles.geometry.attributes.position.array[idx + 2] = (Math.random() - 0.5) * 0.5 * this.fireSize;

        // Reset velocity
        this.particleVelocities[index].x = (Math.random() - 0.5) * 0.3 * this.fireSize;
        this.particleVelocities[index].y = Math.random() * 0.5 + 0.5 * this.fireSize;
        this.particleVelocities[index].z = (Math.random() - 0.5) * 0.3 * this.fireSize;

        // Reset lifespan to 0
        this.particleLifespans[index] = 0;

        // Update the particle color to initial state (bright)
        const colorIdx = index * 3;
        this.particles.geometry.attributes.color.array[colorIdx] = 1.0;      // R
        this.particles.geometry.attributes.color.array[colorIdx + 1] = 0.6;  // G
        this.particles.geometry.attributes.color.array[colorIdx + 2] = 0.0;  // B
    }


}