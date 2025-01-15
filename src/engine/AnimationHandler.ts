import {LoopOnce, AnimationMixer, Mesh, AnimationClip, LoopRepeat} from 'three';
import '../tools/AnimationActionExtensions.js';

export default class Animator{
    animations: Map<string, any> = new Map();
    mixer: AnimationMixer|null = null;
    clips: AnimationClip[] = [];
    current: any = null;
    listeners: Map<string, any> = new Map();

    constructor(mesh: Mesh){
        this.mixer = new AnimationMixer(mesh);
        this.clips = mesh.animations || [];
        this.initializeListeners();
    }

    load(name: string, duration: number, once: boolean){
        const clip = AnimationClip.findByName(this.clips, name);
        const animation = this.mixer!.clipAction(clip);
        animation.setLoop(once ? LoopRepeat : LoopOnce, Infinity);
        animation.clampWhenFinished = true;
        animation.setDuration(duration);
        this.animations.set(name, animation);
        animation.setEffectiveTimeScale(1)
        this.listeners.set(name, new Map());
    }

    play(name: string){
        const newAnim = this.animations.get(name);

        if(!newAnim) return;


        this.stopCurrentAnimation(newAnim);
        this.current = newAnim;
        if(this.current?.isRunning()) return;
        this.invokeListener(this.current._clip.name, 'start');
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

    private initializeListeners() {
        this.mixer!.addEventListener('loop', () => {
            this.invokeListener(this.current._clip.name, 'loop')
        });
        this.mixer!.addEventListener('finished', () => {
            this.invokeListener(this.current._clip.name, 'finished')
        });
        this.mixer!.addEventListener('half', () => {
            this.invokeListener(this.current._clip.name, 'half')
        });
    }

    private invokeListener(name: string, event: string) {
        const listener = this.listeners.get(name);
        if(listener.get(event)) listener.get(event)();
    }

    on(name: string, event: string, callback: () => void){
        this.listeners.get(name).set(event, callback);
    }
}