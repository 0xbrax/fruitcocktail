import { SimpleSprite } from "./SimpleSprite.js";

export class Canopy extends SimpleSprite {
    constructor(scaleFactor, bodyContainer) {
        super("SlotCanopyImage", scaleFactor, bodyContainer, 148);
    }
}