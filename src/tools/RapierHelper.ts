import {ColliderDesc, RigidBodyDesc, World, Vector, RigidBody} from '@dimforge/rapier3d-compat'
import {
    BufferAttribute,
    BufferGeometry,
    EdgesGeometry,
    Float32BufferAttribute,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    SphereGeometry,
    Vector3
} from "three";
import MyWorld from '../entities/world.ts'
import {Player} from "../entities/player.ts";

function createColliderGeo(mesh: Mesh, rigidBody, physicsEngine: World, w: MyWorld){
    const clonedGeo: BufferGeometry = mesh.geometry.clone()
    clonedGeo.applyMatrix4(mesh.matrixWorld)
    const vertices = new Float32Array(clonedGeo.attributes.position.array);
    const indices = new Uint32Array(clonedGeo.index?.array ?? []);
    const colliderDesc = ColliderDesc.trimesh(vertices, indices);
    w.debugMeshes1 = createDebugWireframe(vertices, indices);
    physicsEngine.createCollider(colliderDesc);
}

export function createRigidBodyFixed(mesh: Mesh, physicsEngine: World, w: MyWorld){
    const rigidBodyDesc = RigidBodyDesc.fixed()
    const rigidBody = physicsEngine.createRigidBody(rigidBodyDesc);
    createColliderGeo(mesh, rigidBody, physicsEngine, w, mesh)
}
export function createRigidBodyEntity(position: Vector3, physicsEngine: World, player: Player){
    const rigidBodyDesc = RigidBodyDesc.dynamic()
    rigidBodyDesc.setTranslation(position.x, position.y, position.z);
    const rigidBody = physicsEngine.createRigidBody(rigidBodyDesc);
    player.debugMesh = createDebugSphere(0.25, position);
    const collider = createColliderBall(0.25, rigidBody, physicsEngine)
    return { rigidBody, collider}
}

function createColliderBall(radius: number, rigidBody: any, physicsEngine: World) {
    const colliderDesc = ColliderDesc.ball(radius);
    const collider = physicsEngine.createCollider(colliderDesc,  rigidBody);
    return collider;
}

export function thresholdFloor(float: number, max: number = 0.2): number {
    return Math.abs(float) < max ? 0 : float;
}

export function createColliderDebug(mesh: Mesh){
    const wireframe = new LineSegments(
        new EdgesGeometry(mesh.geometry), new LineBasicMaterial({color: 0xff0000})
    );

    wireframe.position.copy(mesh.position);
    wireframe.rotation.copy(mesh.rotation);
    wireframe.scale.copy(mesh.scale);

    return wireframe;
}

export function createDebugSphere(radius: number, position: Vector3){
    const geo = new SphereGeometry(radius, 16, 16);
    const material = new MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });

    const debugSphere = new Mesh(geo, material);
    debugSphere.position.copy(position);
    return debugSphere;
}

export function createDebugWireframe(vertices: Float32Array, indices: Uint32Array): LineSegments {
    // Create a new buffer geometry for the debug wireframe
    const debugGeometry = new BufferGeometry();

    // Set the vertex positions
    debugGeometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

    // Generate edges from the indices
    const edges = [];
    for (let i = 0; i < indices.length; i += 3) {
        // Each set of 3 indices forms a triangle
        const a = indices[i];
        const b = indices[i + 1];
        const c = indices[i + 2];

        // Add the edges of the triangle to the edges array
        edges.push(a, b, b, c, c, a);
    }

    // Build the edges as a typed Uint16Array
    const edgeIndices = new Uint16Array(edges);
    debugGeometry.setIndex(new BufferAttribute(edgeIndices, 1)); // Fix: Wrap Uint16Array in BufferAttribute

    // Create a material for the wireframe
    const material = new LineBasicMaterial({ color: 0xff0000, linewidth: 1 }); // Red color for debug

    // Create the LineSegments object
    return new LineSegments(debugGeometry, material);
}

export function angle(x: number,z: number){
    return Math.atan2(x,z);
}

export function range(angle1: number, angle2: number){
    let angle = ((angle1 - angle2 + Math.PI) % (2 * Math.PI)) - Math.PI;
    angle < - Math.PI ? angle += 2 * Math.PI : angle;
    return angle;
}

export function findByName(name: string, array: any[]){
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            return array[i];
        }
    }
}