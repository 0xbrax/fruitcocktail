import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { isMobile } from "../system/utils.js";

export class Body {
    constructor() {
        this.scaleFactor = null;
        this.container = new PIXI.Container();
        this.createSprite();
    }

    createSprite() {
        const sprite = new PIXI.Sprite($globals.assets.body["SlotBodyImage"]);

        if (isMobile) {
            this.scaleFactor = (window.innerWidth * 0.95) / sprite.width;

            sprite.width *= this.scaleFactor;
            sprite.height *= this.scaleFactor;
        }
        if (!isMobile) {
            this.scaleFactor = (window.innerHeight * 0.6) / sprite.height;

            sprite.height *= this.scaleFactor;
            sprite.width *= this.scaleFactor;
        }

        this.container.addChild(sprite);
    }
}