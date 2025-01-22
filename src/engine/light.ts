import {AmbientLight, PointLight, Object3D, Vector2, DirectionalLight, DirectionalLightHelper} from "three";
import {Player} from "../entities/player.ts";

export default class Light extends Object3D {
    constructor() {
        super();

        const ambient = new AmbientLight(0xffffff, 0.2);
        const point = new PointLight(0xffffff, 80, 30);
        const directional = new DirectionalLight(0xffffff, 0.5);
        directional.position.set(5,5,-1);

        let helper = new DirectionalLightHelper(directional, 5);

        directional.add(helper);
        directional.castShadow = true;
        let side = 100;
        directional.shadow.camera.top = side;
        directional.shadow.camera.right = side;
        directional.shadow.camera.bottom = -side;
        directional.shadow.camera.left = -side;
        directional.shadow.mapSize = new Vector2(4096, 4096);
        point.position.set(-4, 6, 6);
        point.castShadow = true;
        point.shadow.bias = -0.001
        point.shadow.mapSize = new Vector2(2084, 2084)
        this.add(ambient);
        this.add(directional);
    }

    // @ts-ignore
    update(player: Player){

    }
}
