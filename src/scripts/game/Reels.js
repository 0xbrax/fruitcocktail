import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";

export class Reels {
    constructor(scaleFactor) {
        //super(scaleFactor);
        this.scaleFactor = scaleFactor;

        this.xGap = -10;
        this.container = new PIXI.Container();

        this.createReels();
    }

    createReels() {
        for (let i = 1; i <= 1; i++) {
            const reel = new Reel(this.scaleFactor, i, this.xGap * i);
            this.container.addChild(reel.container);

            console.log('LOG....', i, reel.container.x)
        }
    }
}

