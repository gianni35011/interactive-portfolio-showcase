import { Object3D } from "three";
import {createRigidBodyEntity} from "../tools/RapierHelper.ts";
import {World} from "@dimforge/rapier3d-compat";

export class Player extends Object3D {
    rigidBody: null | any = null
    collider: null | any = null
    constructor({mesh, physicsEngine}: { mesh: Object3D, physicsEngine: World }) {
        super();
        mesh.position.set(0,10,0);
        this.position.copy(mesh.position);
        this.initPhysic(physicsEngine);
        this.initVisual(mesh);
    }

    initPhysic(physicsEngine: World) {
        const {rigidBody, collider} = createRigidBodyEntity(this.position, physicsEngine)
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    initVisual(mesh: Object3D) {
        mesh.position.set(0, 0, 0);
        mesh.castShadow = true;
        this.add(mesh)
    }

    update(){
        this.updatePhysics();
        this.updateVisuals();
    }

    private updatePhysics() {

    }

    private updateVisuals() {
        if (this.rigidBody) {
            this.position.copy(this.rigidBody.translation());
        }
    }
}
