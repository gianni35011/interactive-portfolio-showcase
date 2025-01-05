import {WebGLRenderer, Clock, Object3D, Camera} from 'three'

export class Graphics extends WebGLRenderer {
    scene: Object3D | null = null
    clock = new Clock()
    camera: Camera | null = null
    cbUpdate: ((dt: number) => void) | null = null
    cbLoop: (() => void) | null = null

    constructor({scene, camera}: { scene: Object3D, camera: Camera }) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.cbLoop = this.loop.bind(this);
        this.shadowMap.enabled = true;
        this.loop();
    }

    loop(){
        const dt = this.clock.getDelta();

        if (this.cbUpdate) {
            this.cbUpdate(dt); // cbUpdate should take dt as argument
        }

        if (this.scene && this.camera){
            this.render(this.scene, this.camera);
        }

        if(this.cbLoop){
            requestAnimationFrame(this.cbLoop);
        }
    }

    onUpdate(callback: (dt: number) => void) {
        this.cbUpdate = callback;
    }

}