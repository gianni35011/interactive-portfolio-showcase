import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {Object3D} from "three";

const loaderGLTF = new GLTFLoader();

// export default async function loadAsset(path: string): Promise<{ meshes: Object3D[] }> {
//     const meshes: Object3D[] = [];
//
//     const glb = await loaderGLTF.loadAsync(path);
//
//     glb.scene.traverse(glb => {
//         meshes.push(glb);
//         console.log(glb);
//     })
//
//     return { meshes };
//
// }

export default async function loadAsset(path: string): Promise<{ meshes: Object3D[] }> {
    const meshes: Object3D[] = [];

    const glb = await loaderGLTF.loadAsync(path);

    glb.scene.traverse((child) => {
        meshes.push(child);
        console.log(child);
    })

    return { meshes };

}