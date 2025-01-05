import { AmbientLight, PointLight, Object3D } from "three";

export default class Light extends Object3D {
    constructor() {
        super();

        const ambient = new AmbientLight(0xffffff, 0.7);
        const point = new PointLight(0xffffff);
        point.position.set(1, 0, 4);
        this.add(ambient);
        this.add(point);
    }
}