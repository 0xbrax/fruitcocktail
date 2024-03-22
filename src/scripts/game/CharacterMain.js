import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class CharacterMain {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;
        this.container = new PIXI.Container();
        this.xGap = 1150 * this.scaleFactor;
        this.yGap = 550 * this.scaleFactor;

        this.createSprite();
    }

    createSprite() {
        const textures = Object.values($globals.assets.character['CharacterMainSprite'].textures);
        this.sprite = new PIXI.AnimatedSprite(textures);

        this.sprite.scale.set(this.scaleFactor);
        this.sprite.x = this.xGap;
        this.sprite.y = -this.yGap;

        this.sprite.currentFrame = 0;
        this.sprite.animationSpeed = 0.5;
        this.sprite.play();

        this.container.addChild(this.sprite);
    }
}