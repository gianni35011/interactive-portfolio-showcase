import {Mesh, Object3D, Vector3} from "three";
import {createRigidBodyDynamic, range} from "../tools/RapierHelper.ts";
import {RigidBody, World} from "@dimforge/rapier3d-compat";
import InputManager from "../control/InputManager.ts";
import Animator from "../engine/AnimationHandler.ts";
import SoundManager from "../engine/SoundManager.ts";
import {DialogueManager} from "../engine/DialogueManager.ts";
import {NPC} from "./NPC.ts";

const SPEED: number = 1;
const WALK = "Walking_C";
const IDLE = "Idle";

// Sounds
const GRASS = 'GRASS_FOOTSTEPS';

const GRASS_FOOTSTEPS = [
    'src/assets/sounds/footsteps/grass/00_footstep_grass.wav',
    'src/assets/sounds/footsteps/grass/01_footstep_grass.wav',
    'src/assets/sounds/footsteps/grass/02_footstep_grass.wav',
    'src/assets/sounds/footsteps/grass/03_footstep_grass.wav',
    ]


export interface PlayerDependencies {
    soundManager: SoundManager;
    animator: Animator;
    physicsEngine: World;
    npcList: NPC[];
}

export class Player extends Object3D {
    private static readonly DEFAULT_START_POSITION = new Vector3(0, 2, 0);

    rigidBody: RigidBody | null = null;
    collider: any | null = null;
    controller = new InputManager();
    debugMesh: any = null;
    animator: Animator | null = null;
    soundManager: SoundManager| null = null;
    private dialogueManager: DialogueManager;
    private npcList: NPC[] = [];
    private nearbyNPCs: NPC[] = [];

    constructor(
        playerDependencies: PlayerDependencies,
        mesh: Mesh,
        startPosition: Vector3 = Player.DEFAULT_START_POSITION
    ) {
        super();
        this.soundManager = playerDependencies.soundManager;
        this.animator = playerDependencies.animator;
        mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.position.copy(mesh.position);
        this.initializePhysics(playerDependencies.physicsEngine);
        this.initializeVisual(mesh);
        this.initializeAnimator(mesh);
        this.initializeSound();
        this.syncAnimationSounds()
        this.dialogueManager = new DialogueManager();
        this.npcList = playerDependencies.npcList;
    }

    private initializePhysics(physicsEngine: World) {
        const {rigidBody, collider} = createRigidBodyDynamic(this.position, physicsEngine, this);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    private initializeVisual(mesh: Mesh) {
        mesh.position.set(0, -0.25, 0);
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
        if (!this.soundManager) return;

        this.soundManager.load(GRASS, GRASS_FOOTSTEPS);
    }

    update(dt: number) {
        if (!this.dialogueManager.isActive){
            this.updatePhysics();
            this.checkNPCInteractions();
        }
        this.updateVisuals(dt);
        this.updateAnimation(dt);
    }

    private updatePhysics() {
        if (!this.rigidBody) return;
        // Rotate to face the direction of movement from the controller (Up is up)
        const {x, z} = this.rotateInputClockwise90();
        const y = this.rigidBody.linvel().y;
        this.rigidBody.setLinvel({x: x * SPEED, y, z: z * SPEED}, true);
    }

    private rotateInputClockwise90() {
        const x = this.controller.x;
        const z = this.controller.z;
        return { x: -z, z: x }; // Rotate 90 degrees clockwise
    }

    private updateVisuals(dt: number) {
        if (this.rigidBody) {
            if (this.controller.isMoving)
            {
                const CameraOffset = -Math.PI / 2;
                this.rotation.y += range(this.controller.angle + CameraOffset, this.rotation.y) * dt * 20;
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
        if (!this.animator || !this.soundManager) return;

        this.animator.on(WALK, 'loop', () => {
            this.soundManager!.play(GRASS)
        });
        this.animator.on(WALK, 'half', () => {
            this.soundManager!.play(GRASS)
        });
    }

    private checkNPCInteractions(){
        this.nearbyNPCs = [];

        this.npcList.forEach(npc => {
            if(npc.isInRange(this.position, 1)){
                this.nearbyNPCs.push(npc);
            }
        });

        if(this.controller.interaction && this.nearbyNPCs.length > 0) {
            this.dialogueManager.show(this.nearbyNPCs[0], ["\"Ah… another traveler. Drawn here by fate, or mere curiosity? It matters not. Sit, if you wish. Warm yourself by the embers.", "\"You seek the works of those who came before? Hah… I have seen many. Some forged with steady hands, others… unfinished, yet brimming with intent.\"", "Look upon them, if you dare. Each carries a story, etched in toil and tempered by time."]);
        }



        // const direction = this.rotateInputClockwise90();
        // const ray = new Raycaster(this.position, new Vector3(direction.x, 0, direction.z), 0, 1);
        // const intersects = ray.intersectObjects(scene.children, true);
        // for (const intersect of intersects){
        //     const object = intersect.object;
        //     if (object instanceof NPC){
        //         this.dialogueManager.startDialogue(object);
        //     }
        // }
    }
}
