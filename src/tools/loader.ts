import {GLTF, GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {AnimationClip, Mesh, Object3D} from "three";

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
        mesh.traverse(child => {
            child.castShadow = true;
        })
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

// TODO: Combine with loadStaticAsset
export async function loadStaticAssetArray(path: string): Promise<Mesh[] | null>{
    try{
        const asset = await loadAsset(path);
        const mesh: Mesh[] = [];
        if (!asset) return null;
        for (const child of asset.scene.children) {
            if (child.type === 'Mesh') {
                mesh.push(child as Mesh);
            } else if (child.type === 'Group') {
                for (const subChild of child.children) {
                    if (subChild.type === 'Mesh') {
                        subChild.position.set(child.position.x, child.position.y, child.position.z);
                        mesh.push(subChild as Mesh);
                    }
                }
            }
        }
        return mesh;
    } catch (error: any) {
        console.error(error);
        return null;
    }
}

export async function loadStaticAsset_02(path: string): Promise<Object3D | null>{
    try{
        const asset = await loadAsset(path);
        if(!asset) return null;
        asset.scene.traverse(child => {
            child.castShadow = true;
        })
        return asset.scene;
    } catch (error: any) {
        console.error(error);
        return null;
    }
}