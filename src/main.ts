import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import Camera from './engine/camera'
import Light from './engine/light'
import { Graphics } from './engine/graphics.ts'

const scene = new THREE.Scene();
const camera = new Camera();

const light = new Light();




scene.add(light);
const loader = new GLTFLoader();
loader.load('src/assets/adventurers/mug_empty.gltf', (gltf) => {
    gltf.scene.traverse(c => {
        c.castShadow = true;
    })
    scene.add(gltf.scene);
})

const graphic = new Graphics({scene, camera})
graphic.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(graphic.domElement);

graphic.onUpdate((dt: number) => {
    console.log(`Delta time: ${dt}`);
});
