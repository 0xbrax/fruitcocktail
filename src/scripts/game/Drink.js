import * as PIXI from "pixi.js";
import { gsap } from 'gsap';
import { Emitter } from "@pixi/particle-emitter";
import { $globals } from "../system/utils.js";
import { $style } from "../system/SETUP.js";
import { isMobile } from "../system/utils.js";

export class Drink {
    constructor(scaleFactor) {
        this.EE = new PIXI.utils.EventEmitter();
        this.scaleFactor = scaleFactor;
        this.container = new PIXI.Container();
        this.maskContainer = new PIXI.Container();
        this.emitterContainer = new PIXI.Container();
        this.drink = null;
        this.emitter = null;
        this.rectHeight = 1017 * this.scaleFactor;
        this.bubbleSpeed = 0.002;

        this.yPos = 97;
        this.xPos = 34;

        this.createDrink();
        this.createMasks();
        this.createBubbleEmitter();
    }

    createDrink() {
        this.drink = new PIXI.Graphics();

        const waveAmplitudeBase = 40 * this.scaleFactor;
        const waveFrequencyBase = 0.002 / this.scaleFactor;
        const rectWidth = 1688 * this.scaleFactor;

        let waveAmplitude = waveAmplitudeBase;
        let waveFrequency = waveFrequencyBase;
        let waveOffset = 0;

        const drawWave = () => {
            this.drink.clear();
            this.drink.beginFill(`0x${$style.main}`);

            this.drink.moveTo(0, 0);
            for (let x = 0; x <= rectWidth; x++) {
                let y = (-Math.sin((x * waveFrequency) + waveOffset) * waveAmplitude) - this.rectHeight + waveAmplitudeBase;
                this.drink.lineTo(x, y);
            }
            this.drink.lineTo(rectWidth, 0);
            this.drink.lineTo(rectWidth, this.rectHeight);
            this.drink.lineTo(0, this.rectHeight);
            this.drink.closePath();
            this.drink.endFill();
        };
        const updateWave = () => {
            waveOffset += 0.03;
            waveAmplitude = waveAmplitudeBase + (Math.sin(waveOffset) * 5 * this.scaleFactor);
            waveFrequency = waveFrequencyBase + (Math.sin(waveOffset / 2) * 0.002 * this.scaleFactor);
            drawWave();
        };

        drawWave();
        gsap.to({}, {
            duration: 5,
            repeat: -1,
            ease: "none",
            onUpdate: updateWave
        });

        this.drink.alpha = 0.5;
        this.drink.x = this.xPos * this.scaleFactor;

        this.drink.y = (this.yPos * this.scaleFactor) + this.rectHeight;

        this.container.addChild(this.drink);
    }

    createMasks() {
        let xGap = this.xPos;

        for (let i = 0; i < 5; i++) {
            this.setMask(xGap);
            xGap += 320 + 22;
        }

        this.container.mask = this.maskContainer;
        this.container.addChild(this.maskContainer);
    }

    setMask(xGap) {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(xGap * this.scaleFactor, this.yPos * this.scaleFactor, 323 * this.scaleFactor, 1017 * this.scaleFactor);
        mask.endFill();
        this.maskContainer.addChild(mask);
    }

    createBubbleContainer() {
        const bubbleRect = new PIXI.Graphics();
        bubbleRect.beginFill(0xffffff);
        bubbleRect.drawRect(this.xPos * this.scaleFactor, this.yPos * this.scaleFactor, this.maskContainer.width, this.maskContainer.height);
        bubbleRect.endFill();
        bubbleRect.alpha = 0;
        this.emitterContainer.addChild(bubbleRect);

        const tempContainer = new PIXI.Container();
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(this.xPos * this.scaleFactor, (this.yPos * this.scaleFactor) + (40 * 2 * this.scaleFactor), this.maskContainer.width, this.maskContainer.height - (40 * 2 * this.scaleFactor));
        mask.endFill();
        tempContainer.addChild(mask);
        this.emitterContainer.mask = tempContainer;
        this.emitterContainer.addChild(tempContainer);

        this.container.addChild(this.emitterContainer);
    }

    createBubbleEmitter() {
        this.createBubbleContainer();

        const textures = [$globals.assets.body['BubbleImage']];

        this.emitter = new Emitter(
            this.emitterContainer,
        {
            "lifetime": {
                "min": isMobile ? 0.2 : 0.3,
                "max": isMobile ? 0.3 : 0.4
            },
            "frequency": 0.01,
            "emitterLifetime": 0,
            "maxParticles": 50,
            "addAtBack": false,
            "pos": {
                "x": 0,
                "y": 0
            },
            "behaviors": [
                {
                    "type": "textureRandom",
                    "config": {
                        "textures": textures
                    }
                },
                {
                    "type": "alpha",
                    "config": {
                        "alpha": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 0.5
                                },
                                {
                                    "time": 1,
                                    "value": 0
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "moveSpeedStatic",
                    "config": {
                        "min": -1500 * this.scaleFactor,
                        "max": -2000 * this.scaleFactor
                    }
                },
                {
                    "type": "scale",
                    "config": {
                        "scale": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": isMobile ? 0.5 * this.scaleFactor : 0.6 * this.scaleFactor
                                },
                                {
                                    "time": 1,
                                    "value": isMobile ? 0.7 * this.scaleFactor : 0.8 * this.scaleFactor
                                }
                            ]
                        },
                        "minMult": 0.5
                    }
                },
                {
                    "type": "rotation",
                    "config": {
                        "accel": 0,
                        "minSpeed": 0,
                        "maxSpeed": 50,
                        "minStart": 80,
                        "maxStart": 100
                    }
                },
                {
                    "type": "spawnShape",
                    "config": {
                        "type": "rect",
                        "data": {
                            "x": 0,
                            "y": this.emitterContainer.height + (40 * 3 * this.scaleFactor),
                            "w": this.emitterContainer.width,
                            "h": 0
                        }
                    }
                }
            ]}
        );
    }

    /*resetLevel() {
        this.drink.y = (this.yPos * this.scaleFactor) + this.rectHeight + (this.rectHeight * 0.8);
        this.emitterContainer.y = this.rectHeight * 0.8;
    }*/

    setLevel(level) {
        let lv;
        if (level === 0) lv = 0;
        if (level === 1) lv = 1;
        lv = 1 - (1 / 10 * level);

        const drinkAnimations = gsap.getTweensOf(this.drink);
        const bubbleAnimations = gsap.getTweensOf(this.emitterContainer);

        drinkAnimations.forEach(anim => {
            anim.kill();
        });
        bubbleAnimations.forEach(anim => {
            anim.kill();
        });

        const drinkContainerAnim = gsap.to(this.drink, {
            pixi: { y: (this.yPos * this.scaleFactor) + this.rectHeight + (this.rectHeight * lv) },
            duration: 2.5,
            repeat: 0,
            ease: "none",
            onComplete: () => {
                drinkContainerAnim.kill();
            }
        });

        const bubbleContainerAnim =  gsap.to(this.emitterContainer, {
            pixi: { y: this.rectHeight * lv },
            duration: 2.5,
            repeat: 0,
            ease: "none",
            onComplete: () => {
                bubbleContainerAnim.kill();

                this.EE.emit('animationComplete');
            }
        });
    }

    update(dt) {
        if (this.emitter) {
            this.emitter.update(dt * this.bubbleSpeed);
        }
    }
}