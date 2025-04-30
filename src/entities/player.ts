import {Mesh, Object3D, Vector3, MeshStandardMaterial, Material} from "three";
import {createRigidBodyDynamic, range} from "../tools/RapierHelper.ts";
import {RigidBody, World} from "@dimforge/rapier3d-compat";
import InputManager from "../control/InputManager.ts";
import Animator from "../engine/AnimationHandler.ts";
import SoundManager from "../engine/SoundManager.ts";

import Footstep00Url from '/public/assets/sounds/footsteps/grass/00_footstep_grass.wav';
import Footstep01Url from '/public/assets/sounds/footsteps/grass/00_footstep_grass.wav';
import Footstep02Url from '/public/assets/sounds/footsteps/grass/00_footstep_grass.wav';
import Footstep03Url from '/public/assets/sounds/footsteps/grass/00_footstep_grass.wav';
import {Interactive} from "../engine/Interactive.ts";

const SPEED: number = 1;
const WALK = "Walking_C";
const IDLE = "Idle";

// Sounds
const GRASS = 'GRASS_FOOTSTEPS';

const GRASS_FOOTSTEPS = [
    Footstep00Url,
    Footstep01Url,
    Footstep02Url,
    Footstep03Url,
    ]



export interface PlayerDependencies {
    soundManager: SoundManager;
    animator: Animator;
    physicsEngine: World;
}

export class Player extends Object3D {
    private static readonly DEFAULT_START_POSITION = new Vector3(0, 0.1, 8);

    rigidBody: RigidBody | null = null;
    collider: any | null = null;
    controller = new InputManager();
    debugMesh: any = null;
    animator: Animator | null = null;
    soundManager: SoundManager| null = null;
    private _interactableObjects: Interactive[] = [];
    private _interactiveUIPrompt!: HTMLDivElement;
    private _interactableObjectsInRange: Interactive[] = [];
    private _materials: Material[] = [];
    private _fadeInProgress: boolean = true;
    private _fadeInDuration: number = 1; // Duration in seconds
    private _fadeInDelay: number = 2; // Delay before fade-in starts (in seconds)
    private _fadeInTimer: number = 0;

    constructor(
        playerDependencies: PlayerDependencies,
        mesh: Mesh,
        startPosition: Vector3 = Player.DEFAULT_START_POSITION
    ) {
        super();
        this.soundManager = playerDependencies.soundManager;
        this.animator = playerDependencies.animator;
        mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.position.copy(mesh.position);
        this.initializePhysics(playerDependencies.physicsEngine);
        this.initializeVisual(mesh);
        this.initializeAnimator(mesh);
        this.initializeSound();
        this.syncAnimationSounds();
        this.InteractionUISetup();
        this.setupFadeIn(mesh);
    }

    private InteractionUISetup(): void{
        this._interactiveUIPrompt = document.createElement('div');
        this._interactiveUIPrompt.className = 'interaction-prompt';
        this._interactiveUIPrompt.innerHTML = 'Press <span class="key">E</span> to interact';
        document.body.appendChild(this._interactiveUIPrompt);
    }

    public registerInteractableObject(interactableObject: Interactive): void{
        this._interactableObjects.push(interactableObject);
    }

    private CanInteract(): void{
        this._interactableObjectsInRange = [];
        for (const interactableObject of this._interactableObjects) {
            if(interactableObject.canInteract(this.position)){
                this._interactableObjectsInRange.push(interactableObject);
            }
        }
        if(this._interactableObjectsInRange.length > 0){
            this._interactiveUIPrompt.classList.add('visible');
        }
        else{
            this._interactiveUIPrompt.classList.remove('visible');
        }
    }

    private checkInteraction(): void{
        if(!this._interactableObjectsInRange || this._interactableObjectsInRange.length === 0) return;
        console.log("Checking for interaction");
        const playerPosition: Vector3 = this.position;
        let closestObject: Interactive | null = null;
        let closestDistance: number = Infinity;
        for (const interactableObject of this._interactableObjectsInRange) {
            const distance = playerPosition.distanceTo(interactableObject.getPosition());
            if (distance < closestDistance){
                closestDistance = distance;
                closestObject = interactableObject;
            }
        }
        if (!closestObject) return;
        this.tryInteract(closestObject);
    }

    private tryInteract(InteractableObject: Interactive): void{
        if(InteractableObject){
            InteractableObject.interact();
        }
    }

    private initializePhysics(physicsEngine: World) {
        const {rigidBody, collider} = createRigidBodyDynamic(this.position, physicsEngine, this);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    private initializeVisual(mesh: Mesh) {
        mesh.position.set(0, -0.25, 0);
        mesh.castShadow = true;
        this.add(mesh)
    }

    private initializeAnimator(mesh: Mesh){
        const animator = new Animator(mesh);
        animator.load(IDLE, 0.3, true);
        animator.load(WALK, 0.3, true);
        this.animator = animator;
    }

    private initializeSound() {
        if (!this.soundManager) return;

        this.soundManager.load(GRASS, GRASS_FOOTSTEPS);
    }

    private setupFadeIn(mesh: Mesh): void {
        mesh.traverse((child) => {
            if (child instanceof Mesh) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];

                materials.forEach((material) => {
                    if (material instanceof MeshStandardMaterial) {
                        // Clone material to avoid affecting other instances
                        const newMaterial = material.clone();
                        // Setup for transparency
                        newMaterial.transparent = true;
                        newMaterial.opacity = 0; // Start fully transparent
                        newMaterial.needsUpdate = true;

                        // Replace original material
                        child.material = newMaterial;
                        this._materials.push(newMaterial);
                    }
                });
            }
        });
    }

    update(dt: number) {
        if (this.controller.interaction) {
            this.checkInteraction();
            this.controller.clearInteraction()
        }
        this.CanInteract();
        this.updatePhysics();
        this.updateVisuals(dt);
        this.updateAnimation(dt);

        // Handle fade-in effect
        if (this._fadeInProgress) {
            this.updateFadeIn(dt);
        }
    }

    private updateFadeIn(dt: number): void {
        if (!this._fadeInProgress) return;

        this._fadeInTimer += dt;
        
        // Wait for the delay period before starting the fade-in
        if (this._fadeInTimer < this._fadeInDelay) {
            // Keep objects invisible during delay
            this._materials.forEach(material => {
                if (material instanceof MeshStandardMaterial) {
                    material.opacity = 0;
                }
            });
            return;
        }
        
        // Calculate progress after the delay period
        const progress = Math.min((this._fadeInTimer - this._fadeInDelay) / this._fadeInDuration, 1.0);

        // Update opacity of all materials
        this._materials.forEach(material => {
            if (material instanceof MeshStandardMaterial) {
                material.opacity = progress;
                material.needsUpdate = true;
            }
        });

        // Check if fade-in is complete
        if (progress >= 1.0) {
            this._fadeInProgress = false;

            // Optional: Set materials back to non-transparent for performance
            // after a small delay to ensure the fade is complete
            setTimeout(() => {
                this._materials.forEach(material => {
                    if (material instanceof MeshStandardMaterial) {
                        material.transparent = false;
                        material.needsUpdate = true;
                    }
                });
            }, 1000);
        }
    }

    private updatePhysics() {
        if (!this.rigidBody) return;
        // Rotate to face the direction of movement from the controller (Up is up)
        const {x, z} = this.rotateInputClockwise90();
        const y = this.rigidBody.linvel().y;
        this.rigidBody.setLinvel({x: x * SPEED, y, z: z * SPEED}, true);
    }

    private rotateInputClockwise90() {
        const x = this.controller.x;
        const z = this.controller.z;
        return { x: -z, z: x }; // Rotate 90 degrees clockwise
    }

    private updateVisuals(dt: number) {
        if (this.rigidBody) {
            if (this.controller.isMoving)
            {
                const CameraOffset = -Math.PI / 2;
                this.rotation.y += range(this.controller.angle + CameraOffset, this.rotation.y) * dt * 20;
            }
            this.position.copy(this.rigidBody.translation());
            this.debugMesh.position.copy(this.rigidBody.translation())
        }

    }

    private updateAnimation(dt: number){
        if (this.controller.isMoving){
            this.animator?.play(WALK);
        }
        else{
            this.animator?.play(IDLE);
        }
        this.animator?.update(dt);
    }

    syncAnimationSounds(){
        if (!this.animator || !this.soundManager) return;

        this.animator.on(WALK, 'loop', () => {
            this.soundManager!.play(GRASS)
        });
        this.animator.on(WALK, 'half', () => {
            this.soundManager!.play(GRASS)
        });
    }

}

