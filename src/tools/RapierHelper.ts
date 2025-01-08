import {ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d'
import {Mesh} from "three";

function createColliderGeo(geo, rigidBody, physics){
    const vertices = new Float32Array(geo.attributes.position.array);
    const indices = new Uint32Array(geo.index.array);
    const colliderDesc = ColliderDesc.trimesh(vertices, indices);
    physics.createCollider(colliderDesc);
}

export function createRigidBodyFixed(mesh: Mesh, phyicsEngine){
    const rigidBodyDesc = RigidBodyDesc.fixed()
    const rigidBody = phyicsEngine.createRigidBody(rigidBodyDesc);
    createColliderGeo(mesh.geometry, rigidBody, phyicsEngine)
}