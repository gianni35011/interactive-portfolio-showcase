import {PerspectiveCamera, Vector3} from "three";
import {Player} from "../entities/player.ts";

export default class Camera extends PerspectiveCamera {
    private targetPosition: Vector3 = new Vector3();

    constructor() {
        super(70,
            innerWidth/innerHeight,
            0.1,
            1000)
        this.position.set(0,0,4);
        this.lookAt(0, -2, 0)
    }

    update(player: Player){
        const offset = new Vector3(0,4,4);
        this.targetPosition.copy(player.position).add(offset);
        this.position.copy(player.position);
        this.position.lerp(this.targetPosition, 0.08);
    }
}