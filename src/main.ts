import './style.css'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import Camera from './engine/camera'
import Light from './engine/light'
import { Graphics } from './engine/graphics.ts'
import {loadAnimatedAsset, loadStaticAsset, loadStaticAssetArray} from './tools/loader.ts'
import loader from './tools/loader.ts'
import MyWorld from './entities/world.ts'
import {Player, PlayerDependencies} from "./entities/player.ts";
import Rapier from "./engine/physics.ts"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Mesh} from "three";
import SoundManager from "./engine/SoundManager.ts";
import Animator from "./engine/AnimationHandler.ts";
import {NPC, NPCDependencies} from "./entities/NPC.ts";
import {Tween} from "@tweenjs/tween.js";

const ground_mesh = await loader('src/assets/world/ground/Ground.gltf')
const player_mesh: Mesh | null = await loadAnimatedAsset('src/assets/adventurers/Rogue.glb')
const npc_mesh: Mesh | null = await loadAnimatedAsset('src/assets/adventurers/Barbarian.glb')
const trees: Mesh | null = await loadStaticAsset('src/assets/world/ground/foliage.glb')
const grass: Mesh | null = await loadStaticAsset('src/assets/world/ground/grass/SM_GrassLumpLargeC.gltf')
const centralRuins: Mesh[] | null = await loadStaticAssetArray('src/assets/world/ground/centralRuins/CentralRuins.gltf')
const scene = new THREE.Scene();
const light = new Light();
const camera = new Camera();

let player = null
let npc = null
const DEBUG = false;


if (npc_mesh){
    console.log(npc_mesh);
    const dependencies: NPCDependencies = {
        soundManager: new SoundManager(),
        animator: new Animator(npc_mesh),
        physicsEngine: Rapier
    }
    npc = new NPC(dependencies, npc_mesh);

    scene.add(npc);
}
if (player_mesh){
    console.log(player_mesh);
    const dependencies: PlayerDependencies = {
        soundManager: new SoundManager(),
        animator: new Animator(player_mesh),
        physicsEngine: Rapier,
        npcList: [],
        camera,
    }
    if (npc) dependencies.npcList.push(npc);
    player = new Player(dependencies, player_mesh);
    scene.add(player);
    scene.add(player.debugMesh);
}


if (ground_mesh){
    const world = new MyWorld({visuals: ground_mesh.scene, physicsEngine: Rapier});
    scene.add(world);
    scene.add(world.debugMesh);
}

if (trees) scene.add(trees);
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



scene.add(light);

const graphic = new Graphics({scene, camera})
graphic.setSize(window.innerWidth, windCow.innerHeight);
document.body.appendChild(graphic.domElement);

if(DEBUG){
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
    if (!DEBUG) camera.update(player, dt);
    if (once) {
        camera.updateLookAtTarget(player);
        once = false;
    }
});

