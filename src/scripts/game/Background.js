import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { isMobile } from "../system/utils.js";

export class Background {
    constructor() {
        //this.scaleFactor = null;
        this.container = new PIXI.Container();
        this.createSprite();
    }

    createSprite() {
        const sprite = new PIXI.Sprite($globals.assets.main["BackgroundImage"]);

        /*if (isMobile) {
            this.scaleFactor = (window.innerWidth * 0.9) / sprite.width;

            sprite.width *= this.scaleFactor;
            sprite.height *= this.scaleFactor;
        }
        if (!isMobile) {
            this.scaleFactor = window.innerHeight / sprite.height;

            sprite.height *= this.scaleFactor;
            sprite.width *= this.scaleFactor;
        }*/

        const scale = Math.max(
            window.innerWidth / sprite.width,
            window.innerHeight / sprite.height
        );
        sprite.scale.set(scale);

        //sprite.x = window.innerWidth - sprite.width * scale;
        //sprite.y = window.innerHeight - sprite.height * scale;

        this.container.addChild(sprite);
    }
}