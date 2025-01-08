import {Mesh, Object3D} from "three";
import {createRigidBodyFixed} from "../tools/RapierHelper.ts";
import { World as PhysicsWorld } from "@dimforge/rapier3d-compat";

export default class World extends Object3D {
    constructor({visuals, physicsEngine}: { visuals: Object3D, physicsEngine: PhysicsWorld }) {
        super();
        this.initPhysic(visuals, physicsEngine);
        this.initVisual(visuals);
    }

    initPhysic(meshes: Object3D, physicsEngine: PhysicsWorld) {
        meshes.traverse((result) => {
            console.log("World Meshes", result);
            if (!(result instanceof Mesh)) {
                return;
            }
            createRigidBodyFixed(result, physicsEngine);
        })
    }

    initVisual(meshes: Object3D) {
        // Ensure that the meshes parameter is typed as an array of Mesh objects
        this.add(meshes)
    }
}
