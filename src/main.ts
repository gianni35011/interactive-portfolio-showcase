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


const ground_mesh = await loader('src/assets/world/ground/SM_Ground.gltf')
const player_mesh: GLTF | null = await loader('src/assets/adventurers/Rogue.glb')
const scene = new THREE.Scene();
const camera = new Camera();
const light = new Light();
// console.log(player_mesh)

scene.add(light);
console.log(ground_mesh);

let ab;

import('@dimforge/rapier3d').then(RAPIER =>{
    let gravity = {x: 0.0, y: -9.81, z:0.0}
    ab = new RAPIER.World(gravity);

})

if (player_mesh){
    const player = new Player({mesh: player_mesh.scene});
    scene.add(player);
}

const phy = createPhysicsWorld()

if (ground_mesh){
    const world = new MyWorld({visuals: ground_mesh.scene, physicsEngine: ab});
    scene.add(world);
}

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
});
