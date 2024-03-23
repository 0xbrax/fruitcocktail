import { SimpleSprite } from "./SimpleSprite.js";

export class SplashRight extends SimpleSprite {
    constructor(scaleFactor, bodyContainer) {
        const xGap = bodyContainer.width - (8 * scaleFactor);

        super("SlotSplashRightImage", scaleFactor, bodyContainer, -455, xGap);
    }
}