import { Object3D } from "three";

export class Player extends Object3D {
    constructor({mesh}: { mesh: Object3D }) {
        super();
        console.log(mesh);
        this.position.copy(mesh.position);
        this.initPhysic();
        this.initVisual(mesh);
    }

    initPhysic() {
    }

    initVisual(mesh: Object3D) {
        this.add(mesh)
    }
}
