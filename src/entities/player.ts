import {Mesh, Object3D, Vector3} from "three";
import {createRigidBodyEntity, range} from "../tools/RapierHelper.ts";
import {RigidBody, World} from "@dimforge/rapier3d-compat";
import InputManager from "../control/InputManager.ts";
import Animator from "../engine/AnimationHandler.ts";
import SoundManager from "../engine/SoundManager.ts";

const SPEED: number = 3;
const WALK = "Walking_C";
const IDLE = "Idle";

// Sounds
const GRASS_L = 'src/assets/sounds/footsteps/grass/17_footstep_single_dried_leaves.mp3';
const GRASS_R = 'src/assets/sounds/footsteps/grass/00_footstep_single_dried_leaves.mp3';
export class Player extends Object3D {
    private static readonly DEFAULT_START_POSITION = new Vector3(0, 2, 0);

    rigidBody: RigidBody | null = null;
    collider: any | null = null;
    controller = new InputManager();
    debugMesh: any = null;
    animator: Animator | null = null;
    soundManager: SoundManager = new SoundManager();

    constructor(
        {mesh, physicsEngine}: { mesh: Mesh; physicsEngine: World },
        startPosition: Vector3 = Player.DEFAULT_START_POSITION
    ) {
        super();
        mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.position.copy(mesh.position);
        this.initializePhysics(physicsEngine);
        this.initializeVisual(mesh);
        this.initializeAnimator(mesh);
        this.initializeSound();
        this.syncAnimationSounds()
    }

    private initializePhysics(physicsEngine: World) {
        const {rigidBody, collider} = createRigidBodyEntity(this.position, physicsEngine, this);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    private initializeVisual(mesh: Mesh) {
        mesh.position.set(0, 0, 0);
        mesh.castShadow = true;
        this.add(mesh)
    }

    private initializeAnimator(mesh: Mesh){
        const animator = new Animator(mesh);
        animator.load(IDLE, 0.3, true);
        animator.load(WALK, 0.3, true);
        this.animator = animator;
    }

    private initializeSound() {
        this.soundManager.load(GRASS_L);
        this.soundManager.load(GRASS_R);
    }

    update(dt: number) {
        this.updatePhysics();
        this.updateVisuals(dt);
        this.updateAnimation(dt);
    }

    private updatePhysics() {
        if (!this.rigidBody) return;
        const {x, z} = this.controller;
        const y = this.rigidBody.linvel().y;
        this.rigidBody.setLinvel({x: x * SPEED, y, z: z * SPEED}, true);
    }

    private updateVisuals(dt: number) {
        if (this.rigidBody) {
            if (this.controller.isMoving)
            {
                this.rotation.y += range(this.controller.angle, this.rotation.y) * dt * 20;
            }
            this.position.copy(this.rigidBody.translation());
            this.debugMesh.position.copy(this.rigidBody.translation())
        }

    }

    private updateAnimation(dt: number){
        if (this.controller.isMoving){
            this.animator?.play(WALK);
        }
        else{
            this.animator?.play(IDLE);
        }
        this.animator?.update(dt);
    }

    syncAnimationSounds(){
        if (!this.animator) return;
        this.animator.on(WALK, 'loop', () => {
            this.soundManager.play(GRASS_L)
        });
        this.animator.on(WALK, 'half', () => {
            this.soundManager.play(GRASS_R)
        });
    }
}
