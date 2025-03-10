import './style.css'
import * as THREE from 'three'

import Camera from './engine/camera'
import Light from './engine/light'
import { Graphics } from './engine/graphics.ts'
import {loadAnimatedAsset, loadStaticAsset, loadStaticAsset_02, loadStaticAssetArray} from './tools/loader.ts'
import loader from './tools/loader.ts'
import MyWorld from './entities/world.ts'
import {Player, PlayerDependencies} from "./entities/player.ts";
import { initPhysics } from "./engine/physics.ts"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Mesh, Object3D} from "three";
import SoundManager from "./engine/SoundManager.ts";
import Animator from "./engine/AnimationHandler.ts";
import {NPC, NPCDependencies} from "./entities/NPC.ts";
import {PortfolioOverlay} from "./ui/PortfolioOverlay.ts";
import {Skybox} from "./entities/SkyBox.ts";
import {MusicManager} from "./engine/MusicManager.ts";
import {FogSystem} from "./engine/FogSystem.ts";

import groundUrl from '/public/assets/world/ground/ground.glb';
import playerUrl from '/public/assets/adventurers/Rogue.glb';
import npcUrl from '/public/assets/adventurers/Barbarian.glb';
import treesUrl from '/public/assets/world/ground/foliage_lowpoly.glb';
import grassUrl from '/public/assets/world/ground/grass/SM_GrassLumpLargeC.gltf';
import centralRuinsUrl from '/public/assets/world/ground/centralRuins/CentralRuins.gltf';
import mountainsUrl from '/public/assets/world/ground/mountains/untitled.glb';
import worldCollisionUrl from '/public/assets/world/world_collision.glb';
import SkyBoxUrl from '/public/assets/world/skybox/NightSkyHDRI002_4K-HDR.exr';
import {DialogueManager} from "./engine/DialogueManager.ts";
import Fire from "./entities/fire.ts";

async function initializeGame() {

// Initialize physics
    const Rapier = await initPhysics();

// Load assets using imported URLs
    const ground_mesh = await loader(groundUrl);
    const player_mesh: Mesh | null = await loadAnimatedAsset(playerUrl);
    const npc_mesh: Mesh | null = await loadAnimatedAsset(npcUrl);
    const trees: Mesh | null = await loadStaticAsset(treesUrl);
    const grass: Mesh | null = await loadStaticAsset(grassUrl);
    const centralRuins: Mesh[] | null = await loadStaticAssetArray(centralRuinsUrl);
    const backgroundMountains: Object3D | null = await loadStaticAsset_02(mountainsUrl);
    const world_collision = await loader(worldCollisionUrl);


    const scene = new THREE.Scene();
    const light = new Light();
    const camera = new Camera();

    let player = null
    let npc = null
    const DEBUG = false;


    if (npc_mesh) {
        console.log(npc_mesh);
        const dependencies: NPCDependencies = {
            soundManager: new SoundManager(),
            animator: new Animator(npc_mesh),
            physicsEngine: Rapier,
            dialogueManager: new DialogueManager()
        }
        npc = new NPC(dependencies, npc_mesh);

        scene.add(npc);
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
        if (npc){
            player.registerInteractableObject(npc);
        }
    }

// @ts-ignore
    const portfolioOverlay = new PortfolioOverlay()

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

    const fire = new Fire(5.5, 0.5, 10.2);
    scene.add(fire);
    fire.addHelperToScene(scene);
    //scene.add(light);

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

    let once = true;
    graphic.onUpdate((dt: number) => {
        if (!player || !npc) return;
        npc.update(dt);
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
