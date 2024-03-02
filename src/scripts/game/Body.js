import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class Body {
    constructor(container) {
        this.container = container;
        this.createSprite();
    }

    createSprite() {
        const sprite = new PIXI.Sprite($globals.assets.body["SlotBodyImage"]);

        if (window.innerWidth < window.innerHeight) {
            const scaleFactor = (window.innerWidth * 0.9) / sprite.width;

            sprite.width *= scaleFactor;
            sprite.height *= scaleFactor;
        } else {
            const scaleFactor = (window.innerHeight * 0.7) / sprite.height;

            sprite.height *= scaleFactor;
            sprite.width *= scaleFactor;
        }



        this.container.addChild(sprite);
    }
}