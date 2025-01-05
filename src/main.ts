import './style.css'
import * as THREE from 'three'

import Camera from './engine/camera'
import Light from './engine/light'
import { Graphics } from './engine/graphics.ts'
import loader from './tools/loader.ts'

const scene = new THREE.Scene();
const camera = new Camera();

const light = new Light();




scene.add(light);
const meshes = await loader('src/assets/adventurers/mug_empty.gltf')
scene.add(...meshes.meshes);

// const loader = new GLTFLoader();
// loader.load('src/assets/adventurers/mug_empty.gltf', (gltf) => {
//     gltf.scene.traverse(c => {
//         c.castShadow = true;
//     })
//     console.log(gltf.scene)
//     scene.add(gltf.scene);
// })

const graphic = new Graphics({scene, camera})
graphic.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(graphic.domElement);

graphic.onUpdate((dt: number) => {
    // console.log(`Delta time: ${dt}`);
});
