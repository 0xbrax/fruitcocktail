import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";

export class Background {
    constructor() {
        this.container = new PIXI.Container();
        this.createSprite();
    }

    createSprite() {
        const sprite = new PIXI.Sprite($globals.assets.main["BackgroundImage"]);
        const scaleFactor = window.innerWidth / sprite.width;

        sprite.width = window.innerWidth;
        sprite.height = sprite.height * scaleFactor;
        //sprite.x = window.innerWidth / 2;
        //sprite.y = window.innerHeight / 2;
        //sprite.anchor.set(0.5);

        this.container.addChild(sprite);
    }
}