import {Euler, PerspectiveCamera, Vector3} from "three";
import {Player} from "../entities/player.ts";
import {GUI} from "dat.gui";
import * as TWEEN from "@tweenjs/tween.js";
import {GameState, GameStateManager} from "./GameStateManager.ts";

export default class Camera extends PerspectiveCamera {
    private targetPosition: Vector3 = new Vector3();
    offset = new Vector3(-12, 8, 0);
    LookAtTarget = new Vector3(0, 0, 0);

    private _isPanning = false;
    private originalOffset = new Vector3();
    private originalRotation = new Euler();
    private originalLookAt = new Vector3();

    private stateManager: GameStateManager;

    private tweenGroup = new TWEEN.Group();


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
        this.stateManager = GameStateManager.getInstance();

        this.stateManager.onStateEnter(GameState.CAMERA_TRANSITION, () => {
            this.startPanAnimation(
                new Vector3().copy(this.position).add(new Vector3(0, 800, 0)),
                new Vector3(this.position.x, this.position.y, this.position.z),
                3000
            );
        })
    }

    updateLookAtTarget(player: Player){
        this.position.copy(player.position).add(this.offset);
        this.lookAt(player.position);
    }

    update(player: Player, dt: number){
        if (this._isPanning){
            this.tweenGroup.update();
            return;
        }
        this.targetPosition.copy(player.position).add(this.offset);
        //this.position.copy(player.position);
        this.position.lerp(this.targetPosition, 0.02);
    }

    startPanAnimation(targetPosition: Vector3, targetLookAt: Vector3, duration: number){
        if(this._isPanning) return;
        this._isPanning = true;
        this.originalOffset.copy(this.offset);
        this.originalRotation.copy(this.rotation);
        this.originalLookAt.copy(this.LookAtTarget)

        const tweenPos = new TWEEN.Tween(this.position)
            .to(targetPosition, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

         const tweenRot = new TWEEN.Tween(this.rotation)
            .to(targetPosition, duration)
            .easing(TWEEN.Easing.Quadratic.InOut);

        const tweenLookAt = new TWEEN.Tween(this.LookAtTarget)
            .to(targetLookAt, duration)
            .onUpdate(() => {
                this.lookAt(this.LookAtTarget);
            });

        this.tweenGroup.add(tweenPos);
        this.tweenGroup.add(tweenRot);
        this.tweenGroup.add(tweenLookAt);
    }

    resetToPlayer(duration: number = 3000){
        new TWEEN.Tween(this.offset)
            .to(this.originalOffset, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        new TWEEN.Tween(this.rotation)
            .to(this.originalRotation, duration)
            .start();

        new TWEEN.Tween(this.LookAtTarget)
            .to(this.originalLookAt, duration)
            .onComplete(() => this._isPanning = false)
            .start();
    }

    get isPanning(){
        return this._isPanning;
    }
}