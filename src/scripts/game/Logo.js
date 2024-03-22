import { SimpleSprite } from "./SimpleSprite.js";

export class Logo extends SimpleSprite {
    constructor(scaleFactor, bodyContainer) {
        super("SlotLogoImage", scaleFactor, bodyContainer, 200);
    }
}