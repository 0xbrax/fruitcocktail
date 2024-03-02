import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class Reel {
    constructor(scaleFactor, bodyContainer) {
        this.scaleFactor = scaleFactor;
        this.bodyContainer = bodyContainer;
        this.container = new PIXI.Container();
        //this.createSprite();
    }

    /*createSprite() {
        const sprite = new PIXI.Sprite($globals.assets.body["SlotCanopyImage"]);

        sprite.height *= this.scaleFactor;
        sprite.width *= this.scaleFactor;

        this.container.addChild(sprite);
    }*/
}