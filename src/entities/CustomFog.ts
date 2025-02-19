import {ColorRepresentation, Fog} from "three";

export class CustomFog extends Fog{
    constructor(color: ColorRepresentation, near: number, far: number){
        super(color, near, far);
    }
}