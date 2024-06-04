import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class CharacterSprite {
    constructor(scaleFactor, name, xGap, yGap) {
        this.scaleFactor = scaleFactor;
        this.container = new PIXI.Container();
        this.xGap = xGap * this.scaleFactor;
        this.yGap = yGap * this.scaleFactor;
        this.name = name;
    }

    createSprite() {
        const textures = Object.values($globals.assets.character[this.name].textures);
        this.sprite = new PIXI.AnimatedSprite(textures);

        this.sprite.scale.set(this.scaleFactor);
        this.sprite.x = this.xGap;
        this.sprite.y = -this.yGap;

        this.sprite.currentFrame = 0;
        this.sprite.animationSpeed = 0.5;

        this.container.addChild(this.sprite);
    }
}