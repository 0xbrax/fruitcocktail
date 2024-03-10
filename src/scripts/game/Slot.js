import * as PIXI from "pixi.js";
import { Body } from "./Body.js";
import { Drink } from "./Drink.js";
import { Reels } from "./Reels.js";
import { Canopy } from "./Canopy.js";
import { $configs } from "../system/SETUP.js";
import { gsap } from 'gsap';

export class Slot {
    constructor(backgroundContainer) {
        this.backgroundContainer = backgroundContainer;
        this.container = new PIXI.Container();

        this.body = new Body();
        this.container.addChild(this.body.container);

        this.drink = new Drink(this.body.scaleFactor);
        this.container.addChild(this.drink.container);

        this.reels = new Reels(this.body.scaleFactor);
        this.container.addChild(this.reels.container);

        const canopy = new Canopy(this.body.scaleFactor, this.body.container);
        this.container.addChild(canopy.container);

        this.container.x = (this.backgroundContainer.width / 2) - (this.container.width / 2) + canopy.xGap;
        this.container.y = (this.backgroundContainer.height / 2) - (this.container.height / 2) + canopy.yGap;

        this.reelsFadeStartAnim();
    }

    reelsFadeStartAnim() {
        const yPosFinal = {
            '0': null,
            '1': null,
            '2': null
        };

        this.reels.reels.forEach((reel) => {
            for (let i = 0; i < $configs.REEL_SYMBOL_VIEWS; i++) {
                yPosFinal[i] = reel.symbols[i].y;
                reel.symbols[i].y = reel.symbols[i].y + (1010 * this.body.scaleFactor);
                reel.symbols[i].alpha = 0.5;

                const fadeAnim = gsap.to(reel.symbols[i], {
                    pixi: {
                        y: yPosFinal[i],
                        alpha: 1
                    },
                    duration: 5,
                    repeat: 0,
                    ease: "power1.inOut",
                    onComplete: () => {
                        fadeAnim.kill();
                        this.drink.bubbleSpeed = 0.001;
                        this.drink.setLevel(1);
                    }
                });
            }
        });
    }

    update(dt) {
        this.drink.update(dt);
    }
}