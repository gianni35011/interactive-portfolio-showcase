import { thresholdFloor } from '../tools/RapierHelper.ts'
const ATTACK = 0
const JUMP = 1
const X = 0
const Z = 1

export default class Gamepad {
    get gamepad(){
        return navigator.getGamepads()[0]
    }

    get x(){
        if(!this.gamepad) {
            return 0;
        }
        return thresholdFloor(this.gamepad.axes[X]);
    }

    get z(){
        if(!this.gamepad){
            return 0;
        }
        return thresholdFloor(this.gamepad.axes[Z]);
    }

    get attack(){
        if(!this.gamepad) return false
        return this.gamepad.buttons[ATTACK].pressed;
    }

    get jump(){
        if(!this.gamepad) return false
        return this.gamepad.buttons[JUMP].pressed
    }
}