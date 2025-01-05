import { PerspectiveCamera } from "three";

export default class Camera extends PerspectiveCamera {
    constructor() {
        super(70,
            innerWidth/innerHeight,
            0.1,
            1000)
        this.position.set(0,0,4);
        this.lookAt(0,0,0)
    }
}