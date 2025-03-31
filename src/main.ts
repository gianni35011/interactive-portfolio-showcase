import './style.css'
import * as THREE from 'three'
import {Mesh, Object3D} from 'three'

import Camera from './engine/camera'
import Light from './engine/light'
import {Graphics} from './engine/graphics.ts'
import loader, {loadAnimatedAsset, loadStaticAsset, loadStaticAsset_02, loadStaticAssetArray} from './tools/loader.ts'
import MyWorld from './entities/world.ts'
import {Player, PlayerDependencies} from "./entities/player.ts";
import {initPhysics} from "./engine/physics.ts"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import SoundManager from "./engine/SoundManager.ts";
import Animator from "./engine/AnimationHandler.ts";
import {NPC, NPCDependencies} from "./entities/NPC.ts";
import {PortfolioOverlay} from "./ui/PortfolioOverlay.ts";
import {Skybox} from "./entities/SkyBox.ts";
import {MusicManager} from "./engine/MusicManager.ts";
import {FogSystem} from "./engine/FogSystem.ts";

import groundUrl from '/public/assets/world/ground/ground.glb';
import playerUrl from '/public/assets/adventurers/Rogue.glb';
import npcUrl from '/public/assets/adventurers/Barbarian_NoWeapons.glb';
import npc2Url from '/public/assets/adventurers/Mage.glb';
import treesUrl from '/public/assets/world/ground/foliage_lowpoly.glb';
import grassUrl from '/public/assets/world/ground/grass/SM_GrassLumpLargeC.gltf';
import centralRuinsUrl from '/public/assets/world/ground/centralRuins/CentralRuins.gltf';
import mountainsUrl from '/public/assets/world/ground/mountains/untitled.glb';
import worldCollisionUrl from '/public/assets/world/world_collision.glb';
import SkyBoxUrl from '/public/assets/world/skybox/NightSkyHDRI002_4K-HDR.exr';
import {DialogueManager} from "./engine/DialogueManager.ts";
import Fire from "./entities/fire.ts";
import {EducationOverlay} from "./ui/EducationOverlay.ts";
import {GameState, GameStateManager} from "./engine/GameStateManager.ts";
import {LoadingScreen} from "./ui/LoadingScreen.ts";


async function initializeGame() {

    const stateManager = GameStateManager.getInstance();
    stateManager.setState(GameState.LOADING);

    const loadingScreen = new LoadingScreen();

    let totalAssets = 9;
    let loadedAssets = 0;

    const updateProgress = () => {
        loadedAssets++;
        const progress = (loadedAssets / totalAssets) * 100;
        loadingScreen.updateProgress(progress);
    };

// Initialize physics
    const Rapier = await initPhysics();


// Load assets using imported URLs
    const ground_mesh = await loader(groundUrl);
    const player_mesh: Mesh | null = await loadAnimatedAsset(playerUrl);
    const npc_mesh: Mesh | null = await loadAnimatedAsset(npcUrl);
    const npc_mesh2: Mesh | null = await loadAnimatedAsset(npc2Url);
    const trees: Mesh | null = await loadStaticAsset(treesUrl);
    const grass: Mesh | null = await loadStaticAsset(grassUrl);
    const centralRuins: Mesh[] | null = await loadStaticAssetArray(centralRuinsUrl);
    const backgroundMountains: Object3D | null = await loadStaticAsset_02(mountainsUrl);
    const world_collision = await loader(worldCollisionUrl);


    const scene = new THREE.Scene();
    const light = new Light();
    const camera = new Camera();

    let player = null;
    let npc = null;
    let npc2 = null;
    const DM = new DialogueManager();
    const DEBUG = false;


    if (npc_mesh) {
        console.log(npc_mesh);
        const dependencies: NPCDependencies = {
            soundManager: new SoundManager(),
            animator: new Animator(npc_mesh),
            physicsEngine: Rapier,
            dialogueManager: DM,
            dialogueEntries: [
                {
                    text: "Ah… another traveler. Drawn here by fate, or by purpose? It matters not. All who walk this path seek something.",
                },
                {
                    text: "I have witnessed creations born of skill and resolve—each bearing the mark of its maker. Some shaped in quiet reflection, others tempered through challenge and strife.",
                },
                {
                    text: "If knowledge is what you seek, then look upon them. Their purpose is clear to those with the will to see.",
                }
            ],
        }
        npc = new NPC(dependencies, npc_mesh);

        scene.add(npc);
    }

    if(npc_mesh2){
        console.log(npc_mesh2);
        const dependencies: NPCDependencies = {
            soundManager: new SoundManager(),
            animator: new Animator(npc_mesh2),
            physicsEngine: Rapier,
            dialogueManager: DM,
            dialogueEntries: [
                {
                    text: "Ah… another traveler. Drawn here by fate, or by purpose? It matters not. All who walk this path seek something.",
                },
                {
                    text: "I have witnessed creations born of skill and resolve—each bearing the mark of its maker. Some shaped in quiet reflection, others tempered through challenge and strife.",
                },
                {
                    text: "If knowledge is what you seek, then look upon them. Their purpose is clear to those with the will to see.",
                }
            ],
            npcType: 'education',
        }
        npc2 = new NPC(dependencies, npc_mesh2, new THREE.Vector3(8, 0, 20.25), new THREE.Vector3(0,2,0), "Idle");
        scene.add(npc2);
    }
    if (player_mesh) {
        console.log(player_mesh);
        const dependencies: PlayerDependencies = {
            soundManager: new SoundManager(),
            animator: new Animator(player_mesh),
            physicsEngine: Rapier,
        }
        player = new Player(dependencies, player_mesh);
        scene.add(player);
        scene.add(player.debugMesh);
        if (npc && npc2) {
            player.registerInteractableObject(npc);
            player.registerInteractableObject(npc2);
        }
    }

// @ts-ignore
    const portfolioOverlay = new PortfolioOverlay();
    const educationOverlay = new EducationOverlay();

    if (ground_mesh && world_collision) {
        const world = new MyWorld({
            visuals: ground_mesh.scene,
            collision: world_collision.scene,
            physicsEngine: Rapier
        });
        scene.add(world);
        scene.add(world.debugMesh);
    }


    if (trees) scene.add(trees);
    if (backgroundMountains) scene.add(backgroundMountains);

    if (centralRuins) {
        for (const centralRuin of centralRuins) {
            scene.add(centralRuin);
        }
    }

    if (grass) {
        const grassCount = 10000;
        const grassGeometry = grass.geometry;
        const grassMaterial = grass.material;

        const instancedGrass = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassCount);
        scene.add(instancedGrass);
        const dummy = new THREE.Object3D();
        for (let i = 0; i < grassCount; i++) {
            dummy.position.set(
                Math.random() * 50 - 25,
                0,
                Math.random() * 50 - 25
            );
            dummy.rotation.y = Math.random() * Math.PI * 2;
            dummy.scale.setScalar(Math.random() * 0.5 + 0.75 + 1);
            dummy.updateMatrix();
            instancedGrass.setMatrixAt(i, dummy.matrix);
        }
    }

    const fire = new Fire(9.5, 0.25, 10.2);
    scene.add(fire);
    fire.addHelperToScene(scene);
    scene.add(light);

    const graphic = new Graphics({scene, camera})
    graphic.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(graphic.domElement);

    const hdriPath = SkyBoxUrl;
    new Skybox(scene, graphic, hdriPath);

// @ts-ignore
    const musicManager = new MusicManager();
    const fog = new FogSystem(new THREE.Color().setHex(0xDFE9F3), 0.005);
    scene.fog = fog;

    if (DEBUG) {
        const controls = new OrbitControls(camera, graphic.domElement);
        controls.enableDamping = true; // Optional: Enables smooth damping (e.g., for deceleration)
        controls.dampingFactor = 0.25; // Optional: Controls the speed of damping
        controls.screenSpacePanning = false; // Optional: Prevents panning beyond the scene
        controls.maxPolarAngle = Math.PI / 2;
    }

    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();
    updateProgress();

    let once = true;
    graphic.onUpdate((dt: number) => {
        if (!player || !npc || !npc2) return;
        npc.update(dt);
        npc2.update(dt);
        player.update(dt);
        Rapier.step();
        light.update(player);
        fire.update(dt);
        if (!DEBUG) camera.update(player, dt);
        if (once) {
            camera.updateLookAtTarget(player);
            once = false;
        }
    });
}

initializeGame().catch(error => {
    console.error('Failed to initialise', error);
})


