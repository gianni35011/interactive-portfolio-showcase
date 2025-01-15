import './style.css'
import * as THREE from 'three'

import Camera from './engine/camera'
import Light from './engine/light'
import { Graphics } from './engine/graphics.ts'
import {loadStaticAsset, loadAnimatedAsset } from './tools/loader.ts'
import loader from './tools/loader.ts'
import MyWorld from './entities/world.ts'
import {Player} from "./entities/player.ts";
import {GLTF} from "three/addons/loaders/GLTFLoader.js";
import Rapier from "./engine/physics.ts"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Mesh} from "three";

const ground_mesh = await loader('src/assets/world/ground/Ground.gltf')
const player_mesh: Mesh | null = await loadAnimatedAsset('src/assets/adventurers/Rogue.glb')
const trees: GLTF | null = await loader('src/assets/world/ground/Trees.glb')
const scene = new THREE.Scene();
const light = new Light();
const camera = new Camera();

let player = null


if (player_mesh){
    console.log(player_mesh);
    player = new Player({mesh: player_mesh, physicsEngine: Rapier});
    scene.add(player);
    scene.add(player.debugMesh);
}


if (ground_mesh){
    const world = new MyWorld({visuals: ground_mesh.scene, physicsEngine: Rapier});
    scene.add(world);
    scene.add(world.debugMeshes1);
}

if (trees) scene.add(trees?.scene);

scene.add(light);

const graphic = new Graphics({scene, camera})
graphic.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(graphic.domElement);

const controls = new OrbitControls(camera, graphic.domElement);
controls.enableDamping = true; // Optional: Enables smooth damping (e.g., for deceleration)
controls.dampingFactor = 0.25; // Optional: Controls the speed of damping
controls.screenSpacePanning = false; // Optional: Prevents panning beyond the scene
controls.maxPolarAngle = Math.PI / 2;

graphic.onUpdate((dt: number) => {
    if (!player) return;
    player.update(dt);
    Rapier.step();
    light.update(player);
});
