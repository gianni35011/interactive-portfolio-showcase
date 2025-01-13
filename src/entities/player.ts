import { Object3D, Vector3 } from "three";
import {createRigidBodyEntity} from "../tools/RapierHelper.ts";
import {RigidBody, World} from "@dimforge/rapier3d-compat";
import InputManager from "../control/InputManager.ts";

const SPEED: number = 3;

export class Player extends Object3D {
    private static readonly DEFAULT_START_POSITION = new Vector3(0, 2, 0);

    rigidBody: RigidBody | null = null;
    collider: any | null = null;
    controller = new InputManager();
    debugMesh: any = null;

    constructor(
        {mesh, physicsEngine}: { mesh: Object3D; physicsEngine: World },
        startPosition: Vector3 = Player.DEFAULT_START_POSITION
    ) {
        super();
        mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.position.copy(mesh.position);
        this.initializePhysics(physicsEngine);
        this.initializeVisual(mesh);
    }

    private initializePhysics(physicsEngine: World) {
        const {rigidBody, collider} = createRigidBodyEntity(this.position, physicsEngine, this);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    private initializeVisual(mesh: Object3D) {
        mesh.position.set(0, 0, 0);
        mesh.castShadow = true;
        this.add(mesh)
    }

    update() {
        this.updatePhysics();
        this.updateVisuals();
    }

    private updatePhysics() {
        if (!this.rigidBody) return;
        const {x, z} = this.controller;
        const y = this.rigidBody.linvel().y;
        this.rigidBody.setLinvel({x: x * SPEED, y, z: z * SPEED}, true);
    }

    private updateVisuals() {
        if (this.rigidBody) {
            this.position.copy(this.rigidBody.translation());
            this.debugMesh.position.copy(this.rigidBody.translation())
        }
    }
}
