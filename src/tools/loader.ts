import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';

const loaderGLTF = new GLTFLoader();

export default async function loadAsset(path: string): Promise<GLTF | null> {
    try {
        const gltf = await loaderGLTF.loadAsync(path);
        return gltf;  // Success
    } catch (error: any) {
        console.error(error);  // Error handling
        return null;  // Handle error case
    }
}

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

/*
export default async function loadAsset(path: string): Promise<{ meshes: Object3D[] }> {
    const meshes: Object3D[] = [];

    const glb = await loaderGLTF.loadAsync(path);
    try {
        glb.scene.traverse((child) => {
            meshes.push(child);
            console.log(child);
        })
        return { meshes };

    }
    catch (e) {
        console.log(e);
        console.log("Failed to load asset");
    }


}*/

