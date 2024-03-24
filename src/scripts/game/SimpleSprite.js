import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class SimpleSprite {
    constructor(assetName, scaleFactor, bodyContainer, yGap, xGap) {
        this.scaleFactor = scaleFactor;
        this.bodyContainer = bodyContainer;
        this.assetName = assetName;
        this.xGap = xGap;
        this.yGap = yGap * this.scaleFactor;

        this.container = new PIXI.Container();

        this.createSprite();
    }

    createSprite() {
        this.sprite = new PIXI.Sprite($globals.assets.body[this.assetName]);

        this.sprite.height *= this.scaleFactor;
        this.sprite.width *= this.scaleFactor;
        this.sprite.y = -this.yGap;
        this.xGap = this.xGap || (this.bodyContainer.width / 2 - this.sprite.width / 2);
        this.sprite.x = this.xGap;

        this.container.addChild(this.sprite);
    }
}