import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";

export class Reels {
    constructor(scaleFactor) {
        //super(scaleFactor);
        this.scaleFactor = scaleFactor;

        this.xPos = 0;
        this.xPosIncrement = 150; // symbol width + gap
        this.container = new PIXI.Container();

        this.createReels();
    }

    createReels() {
        for (let i = 1; i <= $configs.REELS; i++) {
            const reel = new Reel(this.scaleFactor, i, this.xPos);
            this.container.addChild(reel.container);

            this.xPos += this.xPosIncrement;

            console.log('LOG....', i, reel.container.x)
        }
    }
}

