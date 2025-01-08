import {ColliderDesc, RigidBodyDesc, World } from '@dimforge/rapier3d-compat'
import {Mesh, Vector3} from "three";

function createColliderGeo(geo, rigidBody, physicsEngine: World){
    const vertices = new Float32Array(geo.attributes.position.array);
    const indices = new Uint32Array(geo.index.array);
    const colliderDesc = ColliderDesc.trimesh(vertices, indices);
    physicsEngine.createCollider(colliderDesc);
}

export function createRigidBodyFixed(mesh: Mesh, physicsEngine: World){
    const rigidBodyDesc = RigidBodyDesc.fixed()
    const rigidBody = physicsEngine.createRigidBody(rigidBodyDesc);
    createColliderGeo(mesh.geometry, rigidBody, physicsEngine)
}
export function createRigidBodyEntity(position: Vector3, physicsEngine: World){
    const rigidBodyDesc = RigidBodyDesc.dynamic()
    rigidBodyDesc.setTranslation(position.x, position.y, position.z);
    const rigidBody = physicsEngine.createRigidBody(rigidBodyDesc);


    const collider = createColliderBall(0.25, rigidBody, physicsEngine)
    return { rigidBody, collider}
}

function createColliderBall(radius: number, rigidBody: any, physicsEngine: World) {
    const colliderDesc = ColliderDesc.ball(radius);
    return physicsEngine.createCollider(colliderDesc,  rigidBody);
}
