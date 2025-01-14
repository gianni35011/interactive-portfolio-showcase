import {GLTF, GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {AnimationClip, Mesh} from "three";

const loaderGLTF = new GLTFLoader();

export default async function loadAsset(path: string): Promise<GLTF | null> {
    try {
        return await loaderGLTF.loadAsync(path);  // Success
    } catch (error: any) {
        console.error(error);  // Error handling
        return null;  // Handle error case
    }
}

export async function loadStaticAsset(path: string): Promise<Mesh | null>{
    try{
        const asset = await loadAsset(path);
        const mesh: Mesh|null = asset?.scene.children[0] as Mesh;
        return mesh;
    } catch (error: any) {
        console.error(error);
        return null;
    }
}

export async function loadAnimatedAsset(path: string): Promise<Mesh | null>{
    try{
        const asset = await loadAsset(path);
        const mesh: Mesh|null = asset?.scene.children[0] as Mesh;
        mesh.traverse(child => {
            child.castShadow = true;
        })
        mesh.animations = asset?.animations as AnimationClip[];
        return mesh;
    } catch (error: any) {
        console.error(error);
        return null;
    }
}