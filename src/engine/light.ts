import {AmbientLight, PointLight, Object3D, Vector2, DirectionalLight, DirectionalLightHelper, Vector3} from "three";
import {Player} from "../entities/player.ts";
import {GUI} from "dat.gui";

class ColorGUIHelper {
    object: any;
    prop: string;
    constructor(object: any, prop: string) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

export default class Light extends Object3D {
    directionalLight: DirectionalLight;
    directionalLightHelper: DirectionalLightHelper;

    constructor() {
        super();

        const ambient = new AmbientLight(0xf04343, 0.2);
        const point = new PointLight(0xffffff, 80, 30);



        const color = 0xffad76;
        const intensity = 1.4;
        this.directionalLight = new DirectionalLight(color, intensity);
        this.directionalLight.position.set(30, 8, -1);
        this.directionalLight.target.position.set(6, 0, 18);
        this.directionalLightHelper = new DirectionalLightHelper(this.directionalLight);

        this.directionalLight.add(this.directionalLightHelper);
        this.directionalLight.castShadow = true;
        let side = 100;
        this.directionalLight.shadow.camera.top = side;
        this.directionalLight.shadow.camera.right = side;
        this.directionalLight.shadow.camera.bottom = -side;
        this.directionalLight.shadow.camera.left = -side;
        this.directionalLight.shadow.mapSize = new Vector2(4096, 4096);
        point.position.set(-4, 6, 6);
        point.castShadow = true;
        point.shadow.bias = -0.001
        point.shadow.mapSize = new Vector2(2084, 2084)
        this.add(ambient);
        this.add(this.directionalLight);
        this.add(this.directionalLight.target);
        this.add(this.directionalLightHelper);

        const gui = new GUI();
        const directionalLight = gui.addFolder('Directional Light');
        directionalLight.addColor(new ColorGUIHelper(this.directionalLight, 'color'), 'value').name('color');
        directionalLight.add(this.directionalLight, 'intensity', 0, 5, 0.01);
        directionalLight.add(ambient, 'intensity', 0, 0.5, 0.01).name('Ambient Intensity');
        directionalLight.addColor(new ColorGUIHelper(ambient, 'color'), 'value').name('Ambient Colour');

        this.makeXYZGUI(gui, this.directionalLight.position, 'position', this.updateLight.bind(this));
        this.makeXYZGUI(gui, this.directionalLight.target.position, 'target', this.updateLight.bind(this));
    }

    updateLight(){
        this.directionalLight.target.updateMatrixWorld();
        this.directionalLightHelper.update();
    }

    makeXYZGUI(gui: GUI, vector3: Vector3, name: string, onChangeFn: () => void) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -30, 30).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 20).onChange(onChangeFn);
        folder.add(vector3, 'z', -30, 30).onChange(onChangeFn);
        folder.open();
    }

    // @ts-ignore
    update(player: Player){

    }
}
