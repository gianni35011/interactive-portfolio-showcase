import {Euler, PerspectiveCamera, Vector3} from "three";
import {Player} from "../entities/player.ts";
import {GUI} from "dat.gui";
import * as TWEEN from "@tweenjs/tween.js";
import {GameState, GameStateManager} from "./GameStateManager.ts";

const customBackEasing = {
        In: function (amount: number) {
            let s = 1.70158;
            return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
        },
        Out: function (amount: number) {
            let s = 1.70158;
            return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
        },
        InOut: function (amount: number) {
            let s = 1.70158 * 0.25;
            // var s = 1.70158 * 1.525;
            if ((amount *= 2) < 1) {
                return 0.5 * (amount * amount * ((s + 1) * amount - s));
            }
            return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
        },
}

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
    private originalPosition: Vector3 = new Vector3();


    constructor() {
        super(70,
            innerWidth/innerHeight,
            0.1,
            10000)
        this.position.set(0,0,0);
        const gui = new GUI();
        const cameraFolder = gui.addFolder('Camera');
        const positionFolder = cameraFolder.addFolder('Position');
        positionFolder.add(this.offset, 'x', -50, 100).name('X');
        positionFolder.add(this.offset, 'y', -50, 100).name('Y');
        positionFolder.add(this.offset, 'z', -50, 100).name('Z');
        this.stateManager = GameStateManager.getInstance();

        this.stateManager.onStateEnter(GameState.CAMERA_TRANSITION_ENTER, () => {
            this.startPanAnimation(
                new Vector3().copy(this.position).add(new Vector3(0, 125, 0)),
                new Vector3(this.position.x, this.position.y, this.position.z),
                2000
            );
        });

        this.stateManager.onStateEnter(GameState.CAMERA_TRANSITION_EXIT, () => {
            this.resetToPlayer(2000);
        });

        this.stateManager.onStateEnter(GameState.PLAYING, () => {
            this._isPanning = false;
        });
    }

    updateLookAtTarget(player: Player){
        this.position.copy(player.position).add(this.offset);
        this.lookAt(player.position);
    }

    // @ts-ignore
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
        this.originalPosition.copy(this.position);
        this.originalOffset.copy(this.offset);
        this.originalRotation.copy(this.rotation);
        this.originalLookAt.copy(this.LookAtTarget)

        const tweenPos = new TWEEN.Tween(this.position)
            .to(targetPosition, duration)
            .easing(customBackEasing.InOut)
            .start().onComplete(()=>{
                const targetState
                    = this.stateManager.npcViewType === 'education' ? GameState.EDUCATION_VIEW : GameState.PORTFOLIO_VIEW;
                this.stateManager.setState(targetState);
            });

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
        this._isPanning = true;

        const tweenPos = new TWEEN.Tween(this.position)
            .to(this.originalPosition, duration)
            .easing(customBackEasing.InOut)
            .start().onComplete(()=>{
                this.stateManager.setState(GameState.PLAYING);
            });

        const tweenRot = new TWEEN.Tween(this.rotation)
            .to(this.originalRotation, duration)
            .easing(TWEEN.Easing.Quadratic.InOut);

        const tweenLookAt = new TWEEN.Tween(this.LookAtTarget)
            .to(this.originalLookAt, duration)
            .onUpdate(() => {
                this.lookAt(this.LookAtTarget);
            });

        this.tweenGroup.removeAll()

        this.tweenGroup.add(tweenPos);
        this.tweenGroup.add(tweenRot);
        this.tweenGroup.add(tweenLookAt);
    }

    get isPanning(){
        return this._isPanning;
    }
}