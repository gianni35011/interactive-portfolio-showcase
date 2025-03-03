import {Vector3} from "three";

export interface Interactive{
    canInteract(playerPosition: Vector3): boolean;
    getPosition(): Vector3;
    interact(): void;
}