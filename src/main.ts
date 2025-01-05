import './style.css'
import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { Player } from './player'
import Camera from './engine/camera'
import Light from './engine/light'

const scene = new THREE.Scene();

const camera = new Camera();

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const player = new Player();
// scene.add(player.mesh);


const light = new Light();

scene.add(light);
const loader = new GLTFLoader();
loader.load('src/assets/adventurers/mug_empty.gltf', (gltf) => {
    gltf.scene.traverse(c => {
        c.castShadow = true;
    })
    scene.add(gltf.scene);
})

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

function animate(){
    player.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);