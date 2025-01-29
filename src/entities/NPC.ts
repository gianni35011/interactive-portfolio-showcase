import {Mesh, Object3D, Vector3} from "three";
import {GUI} from "dat.gui";
import {RigidBody, World} from "@dimforge/rapier3d-compat";
import Animator from "../engine/AnimationHandler.ts";
import SoundManager from "../engine/SoundManager.ts";

const IDLE = "Sit_Chair_Idle";

export interface NPCDependencies{
    soundManager: SoundManager;
    animator: Animator;
    physicsEngine: World;
}

export class NPC extends Object3D{
    private static readonly DEFAULT_START_POSITION: Vector3 = new Vector3(9, 0, 12);

    rigidBody: RigidBody | null = null;
    collider: any | null = null;
    debugMesh: any = null;
    animator: Animator | null = null;
    soundManager: SoundManager | null = null;

    constructor(
        npcDependencies: NPCDependencies,
        mesh: Mesh,
        startPosition: Vector3 = NPC.DEFAULT_START_POSITION
    ){
        super();
        this.soundManager = npcDependencies.soundManager;
        this.animator = npcDependencies.animator;
        mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.position.copy(mesh.position);
        this.initializeVisual(mesh);
        this.initializeAnimator(mesh);
        this.initializeSound();
        this.syncAnimationSounds()
        const gui: GUI = new GUI();
        const positionFolder = gui.addFolder('Position');
        const rotationFolder = gui.addFolder('Rotation');
        rotationFolder.add(this.rotation, 'x', -Math.PI, Math.PI).name('X');
        rotationFolder.add(this.rotation, 'y', -Math.PI, Math.PI).name('Y');
        rotationFolder.add(this.rotation, 'z', -Math.PI, Math.PI).name('Z');
        positionFolder.add(this.position, 'x', -1 + NPC.DEFAULT_START_POSITION.x, 1 + NPC.DEFAULT_START_POSITION.x).name('X');
        positionFolder.add(this.position, 'y', -1 + NPC.DEFAULT_START_POSITION.y, 1 + NPC.DEFAULT_START_POSITION.y).name('Y');
        positionFolder.add(this.position, 'z', -1 + NPC.DEFAULT_START_POSITION.z, 1 + NPC.DEFAULT_START_POSITION.z).name('Z');

    }

    private initializeVisual(mesh: Mesh) {
        mesh.position.set(0, -0.25, 0);
        mesh.castShadow = true;
        this.add(mesh)
    }

    private initializeAnimator(mesh: Mesh){
        const animator = new Animator(mesh);
        animator.load(IDLE, 0.3, true);
        animator.play(IDLE);
        this.animator = animator;
    }

    private updateAnimation(dt: number){
        this.animator?.update(dt);
    }

    private initializeSound() {
        return;
        // this.soundManager.load(GRASS, GRASS_FOOTSTEPS);
    }

    syncAnimationSounds() {
        if (!this.animator) return;
    }

    update(dt: number){
        this.updateAnimation(dt);
    }
}

