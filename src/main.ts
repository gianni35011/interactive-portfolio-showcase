import './style.css'
import * as THREE from 'three'

import Camera from './engine/camera'
import Light from './engine/light'
import { Graphics } from './engine/graphics.ts'
import loader from './tools/loader.ts'
import MyWorld from './entities/world.ts'
import {Player} from "./entities/player.ts";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTF} from "three/addons/loaders/GLTFLoader.js";
import Rapier from "./engine/physics.ts"

const ground_mesh = await loader('src/assets/world/ground/SM_Ground.gltf')
const player_mesh: GLTF | null = await loader('src/assets/adventurers/Rogue.glb')

const scene = new THREE.Scene();
const camera = new Camera();
const light = new Light();


let player = null
if (player_mesh){
    player = new Player({mesh: player_mesh.scene, physicsEngine: Rapier});
    scene.add(player);
}

if (ground_mesh){
    const world = new MyWorld({visuals: ground_mesh.scene, physicsEngine: Rapier});
    scene.add(world);
}

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
    controls.update();
    if (!player) return;
    player.update();
    Rapier.step()
});
