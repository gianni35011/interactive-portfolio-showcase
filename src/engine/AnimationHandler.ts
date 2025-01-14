import {LoopOnce, AnimationMixer, Mesh, AnimationClip, LoopRepeat} from 'three';

export default class Animator{
    animations: Map<string, any> = new Map();
    mixer: AnimationMixer|null = null;
    clips: AnimationClip[] = [];
    current: any = null;

    constructor(mesh: Mesh){
        this.mixer = new AnimationMixer(mesh);
        this.clips = mesh.animations || [];
    }

    load(name: string, duration: number, once: boolean){
        const clip = AnimationClip.findByName(this.clips, name);
        const animation = this.mixer!.clipAction(clip);
        animation.setLoop(once ? LoopOnce : LoopRepeat, Infinity);
        animation.clampWhenFinished = true;
        animation.setDuration(duration);
        this.animations.set(name, animation);
    }

    play(name: string){
        const animation = this.animations.get(name);
        if(this.current && this.current !== animation){
            if(this.current.isRunning()) return;

            this.current.stop();
            this.current = animation;
            animation.play();
        }
    }

    update(dt: number){
        this.mixer!.update(dt);
    }
}