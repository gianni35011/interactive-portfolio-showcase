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
        animation.setLoop(once ? LoopRepeat : LoopOnce, Infinity);
        animation.clampWhenFinished = true;
        animation.setDuration(duration);
        this.animations.set(name, animation);
    }

    play(name: string){
        const newAnim = this.animations.get(name);

        if(!newAnim) return;


        this.stopCurrentAnimation(newAnim);
        this.current = newAnim;
        if(this.current?.isRunning()) return;
        this.current.play();
    }

    private stopCurrentAnimation(newAnimation: any){
        if(this.current && this.current !== newAnimation){
            this.current.stop();
        }
    }

    update(dt: number){
        this.mixer!.update(dt);
    }
}