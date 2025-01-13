import {Mesh, Object3D } from "three";
import {createColliderDebug, createRigidBodyFixed} from "../tools/RapierHelper.ts";
import { World as PhysicsWorld } from "@dimforge/rapier3d-compat";

export default class World extends Object3D {
     debugMeshes1: any = null;

    constructor({visuals, physicsEngine}: { visuals: Object3D, physicsEngine: PhysicsWorld }) {
        super();
        this.initPhysic(visuals, physicsEngine);
        this.initVisual(visuals);
    }

    initPhysic(meshes: Object3D, physicsEngine: PhysicsWorld) {
        meshes.traverse((result: Object3D) => {
                if (result.type !== "Mesh" || !(result instanceof Mesh)) {
                    return; // Skip non-mesh objects
                }
                createRigidBodyFixed(result, physicsEngine, this);
        });
    }

    initVisual(meshes: Object3D) {
        // Ensure that the meshes parameter is typed as an array of Mesh objects
        this.add(meshes)
    }
}
