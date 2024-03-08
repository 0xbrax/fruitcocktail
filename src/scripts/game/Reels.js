import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";
import { getCryptoRandomNumber } from "../system/utils.js";

export class Reels {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;

        this.xPos = 0;
        this.xPosIncrement = $configs.SYMBOL_SIZE - 99;
        this.container = new PIXI.Container();
        this.reels = [];

        this.createReels();





        const animConfig = { duration: 6, revolutions: 4, ease: 'power2.inOut' };
        animConfig.onComplete = () => {
            //mixerAudio.slotTickFX.play();
            //if (i === 5) this.onComplete();
        }

        window.addEventListener('click', () => {
            const randomCondition = $configs.CONDITIONS[getCryptoRandomNumber(0, $configs.CONDITIONS.length - 1)];
            const symbols = [...$configs.SYMBOLS, $configs.JOLLY, $configs.MEGA_WIN];
            const randomSymbol = symbols[getCryptoRandomNumber(0, symbols.length - 1)];

            const indexes = {};

            for (let i = 0; i < $configs.REELS; i++) {
                const reelNumber = i + 1;
                indexes[reelNumber] = $configs.MAP[`REEL_${reelNumber}`].indexOf(randomSymbol);

                this.reels[i].animation.toIndex(indexes[i + 1], animConfig);
            }

            console.log('RESULT......', randomCondition, '- - - - -', randomSymbol);
        });
    }

    createReels() {
        for (let i = 1; i <= $configs.REELS; i++) {
            const reel = new Reel(this.scaleFactor, i, this.xPos);
            this.container.addChild(reel.container);
            this.reels.push(reel);

            this.xPos += this.xPosIncrement;
        }
    }




    update(dt) {
        //console.log(dt)
    }
}

