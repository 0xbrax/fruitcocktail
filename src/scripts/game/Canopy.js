import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class Canopy {
    constructor(scaleFactor, bodyContainer) {
        this.scaleFactor = scaleFactor;
        this.bodyContainer = bodyContainer;
        this.xGap = null;
        this.yGap = 148 * this.scaleFactor;
        this.container = new PIXI.Container();
        this.createSprite();
    }

    createSprite() {
        const sprite = new PIXI.Sprite($globals.assets.body["SlotCanopyImage"]);

        sprite.height *= this.scaleFactor;
        sprite.width *= this.scaleFactor;
        sprite.y = -this.yGap;
        this.xGap = Math.abs(this.bodyContainer.width - sprite.width) / 2;
        sprite.x = -this.xGap

        this.container.addChild(sprite);
    }
}