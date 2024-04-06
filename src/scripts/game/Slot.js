import * as PIXI from "pixi.js";
import { Body } from "./Body.js";
import { Drink } from "./Drink.js";
import { Reels } from "./Reels.js";
import { Canopy } from "./Canopy.js";
import { Logo } from "./Logo.js";
import { SplashLeft } from "./SplashLeft.js";
import { SplashRight } from "./SplashRight.js";
import { CharacterMain } from "./CharacterMain.js";
import { Balance } from "./Balance.js";
import { $configs } from "../system/SETUP.js";
import { $globals } from "../system/utils.js";
import { gsap } from 'gsap';

export class Slot extends PIXI.utils.EventEmitter {
    constructor() {
        super();
        this.container = new PIXI.Container();
        this.isReady = false;
        this.bonusCounter = 1;

        this.body = new Body();
        this.container.addChild(this.body.container);

        this.drink = new Drink(this.body.scaleFactor);
        this.container.addChild(this.drink.container);

        this.reels = new Reels(this.body.scaleFactor);
        this.container.addChild(this.reels.container);

        this.canopy = new Canopy(this.body.scaleFactor, this.body.container);
        this.container.addChild(this.canopy.container);

        this.logo = new Logo(this.body.scaleFactor, this.body.container);
        this.container.addChild(this.logo.container);

        this.splashLeft = new SplashLeft(this.body.scaleFactor, this.body.container);
        this.container.addChild(this.splashLeft.container);

        this.splashRight = new SplashRight(this.body.scaleFactor, this.body.container);
        this.container.addChild(this.splashRight.container);

        this.characterMain = new CharacterMain(this.body.scaleFactor);
        this.container.addChild(this.characterMain.container);

        this.balance = new Balance(this.body.scaleFactor, this.body.container);
        this.container.addChild(this.balance.container);

        this.reelsFadeIn();

        this.reels.on('animationComplete', () => {
            this.bonusCounter++;
            this.drink.setLevel(this.bonusCounter);
        });

        this.drink.once('animationComplete', () => {
            const [, , RandomTextureBehavior] = this.drink.emitter.initBehaviors;

            this.drink.emitter.emit = false;
            RandomTextureBehavior.textures = [$globals.assets.main['BubbleImage']];
            this.drink.emitter.emit = true;
        });
    }

    reelsFadeIn() {
        const yPosFinal = {
            '0': null,
            '1': null,
            '2': null
        };

        this.reels.reels.forEach((reel) => {
            for (let i = 0; i < $configs.REEL_SYMBOL_VIEWS; i++) {
                yPosFinal[i] = reel.symbols[i].y;
                reel.symbols[i].y = reel.symbols[i].y + (1010 * this.body.scaleFactor);
                reel.symbols[i].alpha = 0;

                const fadeAnim = gsap.to(reel.symbols[i], {
                    pixi: {
                        y: yPosFinal[i],
                        alpha: 1
                    },
                    duration: 2.5,
                    delay: 5,
                    repeat: 0,
                    ease: "power1.inOut",
                    onComplete: () => {
                        fadeAnim.kill();
                        this.isReady = true;
                    }
                });
            }
        });

        setTimeout(() => {
            this.drink.bubbleSpeed = 0.001;
            this.drink.setLevel(this.bonusCounter);
            this.emit('preReady');
        }, 5_000);
    }

    update(dt) {
        this.drink.update(dt);
    }
}