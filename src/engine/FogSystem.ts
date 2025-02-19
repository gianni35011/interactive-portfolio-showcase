import {FogExp2, ColorRepresentation } from "three";

// @ts-ignore
interface FogConfig{
    color?: number;
    density? : number;
    heightFactor?: number;
    animationSpeed?: number;
}

export class FogSystem extends FogExp2{
    constructor(color: ColorRepresentation, density: number){
        super(color, density);
    }
}