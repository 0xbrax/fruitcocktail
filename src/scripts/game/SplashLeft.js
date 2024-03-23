import { SimpleSprite } from "./SimpleSprite.js";

export class SplashLeft extends SimpleSprite {
    constructor(scaleFactor, bodyContainer) {
        const xGap = -(176 * scaleFactor);

        super("SlotSplashLeftImage", scaleFactor, bodyContainer, -455, xGap);
    }
}