import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";
import { $globals } from "../system/utils.js";

export class Reels {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;

        this.xPos = 0;
        this.xPosIncrement = $configs.SYMBOL_SIZE - 99;
        this.container = new PIXI.Container();

        this.reels = [];

        this.createReels();
    }

    createReels() {
        for (let i = 1; i <= $configs.REELS; i++) {
            const reel = new Reel(this.scaleFactor, i, this.xPos);
            this.container.addChild(reel.container);

            this.reels.push(reel.self);

            this.xPos += this.xPosIncrement;
        }
    }

    /*const animConfig = { duration: parseFloat((newAnimDuration + animDelay).toFixed(2)), revolutions: newAnimRevolutions, ease: 'power2.inOut' };
    animConfig.onComplete = () => {
        mixerAudio.slotTickFX.play();
        if (i === 5) this.onComplete();
    }

    slotAnimation[`reel${i}Animation`].toIndex(indexReels[`indexReel${i}`], animConfig); // auto clear*/

    /*verticalLoop(reel, maskDimension, elementsHeightWrap, {
        repeat: -1,
    paused: true,
    center: true,
});*/



    update(dt) {
        //console.log(dt)
    }
}

