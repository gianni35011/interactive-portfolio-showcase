import {PerspectiveCamera, Vector3} from "three";
import {Player} from "../entities/player.ts";
import {GUI} from "dat.gui";

export default class Camera extends PerspectiveCamera {
    private targetPosition: Vector3 = new Vector3();
    offset = new Vector3(-12, 8, 0);
    LookAtTarget = new Vector3(0, 0, 0);

    constructor() {
        super(70,
            innerWidth/innerHeight,
            0.1,
            1000)
        this.position.set(0,0,0);
        const gui = new GUI();
        const cameraFolder = gui.addFolder('Camera');
        const positionFolder = cameraFolder.addFolder('Position');
        positionFolder.add(this.offset, 'x', -50, 100).name('X');
        positionFolder.add(this.offset, 'y', -50, 100).name('Y');
        positionFolder.add(this.offset, 'z', -50, 100).name('Z');
    }

    updateLookAtTarget(player: Player){
        this.position.copy(player.position).add(this.offset);
        this.lookAt(player.position);
    }

    update(player: Player){
        this.targetPosition.copy(player.position).add(this.offset);
        //this.position.copy(player.position);
        this.position.lerp(this.targetPosition, 0.02);
    }

}