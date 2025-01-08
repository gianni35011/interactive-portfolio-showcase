import {Mesh, Object3D} from "three";
import {createRigidBodyFixed} from "../tools/RapierHelper.ts";

export default class World extends Object3D {
    constructor({visuals}: { visuals: Object3D, physicsEngine }) {
        super();
        this.initPhysic(visuals);
        this.initVisual(visuals);
    }

    initPhysic(meshes: Object3D, physicsEngine) {
        meshes.traverse((result) => {
            console.log("Meshes", result);
            // if (result instanceof Mesh) {
            //     createRigidBodyFixed(result, physicsEngine);
            // }
        })
    }

    initVisual(meshes: Object3D) {
        // Ensure that the meshes parameter is typed as an array of Mesh objects
        this.add(meshes)
    }
}
