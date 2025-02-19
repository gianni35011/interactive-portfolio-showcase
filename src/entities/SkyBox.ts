import {EquirectangularReflectionMapping, PMREMGenerator, Scene, TextureLoader} from "three";
import {Graphics} from "../engine/graphics.ts";
import {EXRLoader} from "three/addons/loaders/EXRLoader.js";
import {GUI} from "dat.gui";

export class Skybox{
    constructor(scene: Scene, renderer: Graphics, hdriPath: string) {

        this.loadEXR(scene, renderer, hdriPath);
        this.addControls(scene);
    }

    // @ts-ignore
    private loadTexture(scene: Scene, renderer: Graphics, hdriPath: string): void {
        const pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        const textureLoader = new TextureLoader();
        textureLoader.load(hdriPath, (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;

            scene.environment = envMap;
            scene.background = envMap;
            scene.backgroundIntensity = 1;
            scene.environmentIntensity = 1;

            texture.dispose();
            pmremGenerator.dispose();
        });
    }

    private loadEXR(scene: Scene, renderer: Graphics, exrPath: string): void {
        const pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        const exrLoader = new EXRLoader();
        exrLoader.load(exrPath, (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;

            scene.environment = envMap;
            scene.background = envMap;

            // Set initial values
            scene.backgroundBlurriness = 0;
            scene.backgroundIntensity = 1;

            texture.dispose();
            pmremGenerator.dispose();
        });
    }

    private addControls(scene: Scene): void {
        const gui = new GUI();
        const skyboxFolder = gui.addFolder('Skybox');

        // Add controls for fine-tuning
        skyboxFolder.add(scene, 'backgroundBlurriness', 0, 1)
            .name('Blur')
            .onChange((value: number) => {
                scene.backgroundBlurriness = value;
            });

        skyboxFolder.add(scene, 'backgroundIntensity', 0, 2)
            .name('Intensity')
            .onChange((value: number) => {
                scene.backgroundIntensity = value;
            });
    }
}