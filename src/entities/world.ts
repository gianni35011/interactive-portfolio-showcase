import {Mesh, Object3D } from "three";
import {createRigidBodyFixed} from "../tools/RapierHelper.ts";
import { World as PhysicsWorld } from "@dimforge/rapier3d-compat";

export default class World extends Object3D {
     debugMesh: any = null;

    constructor({visuals, collision, physicsEngine}: { visuals: Object3D, collision: Object3D, physicsEngine: PhysicsWorld }) {
        super();
        this.initPhysic(visuals, collision, physicsEngine);
        this.initVisual(visuals);
    }

    initPhysic(meshes: Object3D, collision: Object3D, physicsEngine: PhysicsWorld) {
        meshes.traverse((result: Object3D) => {
                if (result.type !== "Mesh") {
                    return; // Skip non-mesh objects
                }
                const meshResult = result as Mesh;
                meshResult.castShadow = true;
                meshResult.receiveShadow = true;

                const collResult = collision as Mesh;
                collResult.castShadow = true;
                collResult.receiveShadow = true;

                createRigidBodyFixed(meshResult, physicsEngine, this);

        });

        collision.traverse((result: Object3D) => {

            if(result.type !== "Mesh"){
                return;
            }
            const collResult = result as Mesh;
            collResult.castShadow = true;
            collResult.receiveShadow = true;

            createRigidBodyFixed(collResult, physicsEngine, this);
        });
    }

    initVisual(meshes: Object3D) {
        // Ensure that the meshes parameter is typed as an array of Mesh objects
        this.add(meshes)
    }
}
