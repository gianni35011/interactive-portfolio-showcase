import {Mesh, Object3D, Vector3} from "three";
import {GUI} from "dat.gui";
import {RigidBody, World} from "@dimforge/rapier3d-compat";
import Animator from "../engine/AnimationHandler.ts";
import SoundManager from "../engine/SoundManager.ts";
import {DialogueEntry, DialogueManager} from "../engine/DialogueManager.ts";

import Audio00Url from '/public/assets/voiceLines/ProjectsNPC/1_ProjectsNPC.mp3';
import Audio01Url from '/public/assets/voiceLines/ProjectsNPC/2_ProjectsNPC.mp3';
import Audio02Url from '/public/assets/voiceLines/ProjectsNPC/3_ProjectsNPC.mp3';
import {Interactive} from "../engine/Interactive.ts";

const IDLE = "Sit_Chair_Idle";

export interface NPCDependencies{
    soundManager: SoundManager;
    animator: Animator;
    physicsEngine: World;
    dialogueManager: DialogueManager;
}


export class NPC extends Object3D implements  Interactive{
    private static readonly DEFAULT_START_POSITION: Vector3 = new Vector3(9, 0, 12);

    rigidBody: RigidBody | null = null;
    collider: any | null = null;
    debugMesh: any = null;
    animator: Animator | null = null;
    soundManager: SoundManager | null = null;
    private _dialogueManager: DialogueManager | null = null;
    private _interactiveDistance: number = 4;
    private _dialogueEntries: DialogueEntry[] = [
        {
            text: "Ah… another traveler. Drawn here by fate, or by purpose? It matters not. All who walk this path seek something.",
            audioPath: Audio00Url
        },
        {
            text: "I have witnessed creations born of skill and resolve—each bearing the mark of its maker. Some shaped in quiet reflection, others tempered through challenge and strife.",
            audioPath: Audio01Url
        },
        {
            text: "If knowledge is what you seek, then look upon them. Their purpose is clear to those with the will to see.",
            audioPath: Audio02Url
        }
    ];

    private audioElements: Map<string, HTMLAudioElement> = new Map();
    //private dialogueText: string[] = ["\"Ah… another traveler. Drawn here by fate, or mere curiosity? It matters not. Sit, if you wish. Warm yourself by the embers.", "\"You seek the works of those who came before? Hah… I have seen many. Some forged with steady hands, others… unfinished, yet brimming with intent.\"", "Look upon them, if you dare. Each carries a story, etched in toil and tempered by time."];


    constructor(
        npcDependencies: NPCDependencies,
        mesh: Mesh,
        startPosition: Vector3 = NPC.DEFAULT_START_POSITION
    ){
        super();
        this.soundManager = npcDependencies.soundManager;
        this.animator = npcDependencies.animator;
        this._dialogueManager = npcDependencies.dialogueManager;
        mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.position.copy(mesh.position);
        this.initializeVisual(mesh);
        this.initializeAnimator(mesh);
        this.initializeSound();
        this.syncAnimationSounds();
        this.initializeAudio();
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

    private initializeAudio() {
        this._dialogueEntries.forEach((entry) =>{
            if(entry.audioPath){
                const audio = new Audio(entry.audioPath);
                audio.preload = 'auto';
                this.audioElements.set(entry.audioPath, audio);
            }
        })
    };

    get dialogueEntries(): DialogueEntry[]{
        return this._dialogueEntries;
    }

    playAudio(audioPath: string){
        const audio = this.audioElements.get(audioPath);
        if(audio){
            this.stopAllAudio();
            audio.play();
        }
    }

    stopAllAudio(){
        this.audioElements.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
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

    canInteract(playerPosition: Vector3): boolean {
       if (playerPosition.distanceTo(this.position) < this._interactiveDistance) return true;
    }

    getPosition(): Vector3 {
        return this.position;
    }

    interact() {
        if (!this._dialogueManager) return;
        this._dialogueManager.startDialogue(this);
    }
}
