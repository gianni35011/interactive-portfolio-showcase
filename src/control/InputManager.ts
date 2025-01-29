import { thresholdFloor, angle } from '../tools/RapierHelper.ts'
const ATTACK = 0
const JUMP = 1
const X = 0
const Z = 1

export default class InputManager {
    private keys: Set<string>;
    private interactionPressed = false;

    constructor() {
        this.keys = new Set<string>();
        this.bindKeyboardEvents();
    }

    bindKeyboardEvents() {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            this.keys.add(key);

            if(key === 'e')  {
                this.interactionPressed = true;
                console.log("Interaction pressed");
            }
            this.preventScrolling(e);

        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            this.keys.delete(key);

            if(key === 'e') this.interactionPressed = false;

            this.preventScrolling(e);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }

    preventScrolling(event: KeyboardEvent) {
        const controlKeys = new Set([
            ' ', 'control', 'shift',
            'w', 'a', 's', 'd',
            'arrowup', 'arrowdown', 'arrowleft', 'arrowright'
        ])

        if (controlKeys.has(event.key.toLowerCase())) {
            event.preventDefault()
        }
    }

    clearInteraction(){
        this.interactionPressed = false;
        if (this.gamepad && this.gamepad.buttons[0]) {
            // this.gamepad.buttons[0].pressed = false;
        }
    }

    get interaction(){
        if(this.gamepad){
            return this.gamepad.buttons[2]?.pressed;
        }
        return this.interactionPressed;
    }

    get gamepad(){
        return navigator.getGamepads()[0]
    }

    get x(){
        if(this.gamepad){
            return thresholdFloor(this.gamepad.axes[X]);
        } else {
            let x = 0;
            if(this.keys.has('a') || this.keys.has('arrowleft')){
                x -= 1;
            }
            if (this.keys.has('d') || this.keys.has('arrowright')){
                x += 1;
            }
            return x;
        }
    }

    get z(){
        if (this.gamepad) {
            return thresholdFloor(this.gamepad.axes[Z]);
        } else {
            // Keyboard controls (W/S or Arrow Up/Down)
            let z = 0;
            if (this.keys.has('w') || this.keys.has('arrowup')) z -= 1;
            if (this.keys.has('s') || this.keys.has('arrowdown')) z += 1;
            return z;
        }
    }

    get attack(){
        if(!this.gamepad) return false
        return this.gamepad.buttons[ATTACK].pressed;
    }

    get jump(){
        if(!this.gamepad) return false
        return this.gamepad.buttons[JUMP].pressed
    }

    get angle(){
        return angle(this.x, this.z);
    }

    get isMoving(){
        return Math.abs(this.x) !== 0 || Math.abs(this.z) !== 0;
    }
}