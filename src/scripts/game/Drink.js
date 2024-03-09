import * as PIXI from "pixi.js";
import { gsap } from 'gsap';
import { Emitter } from "@pixi/particle-emitter";
import { $globals } from "../system/utils.js";
import { $style } from "../system/SETUP.js";

export class Drink {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;
        this.container = new PIXI.Container();
        this.maskContainer = new PIXI.Container();
        this.emitterContainer = new PIXI.Container();
        this.emitter = null;

        this.createDrink();
        this.createMasks();
        this.createBubbleEmitter();
    }

    createDrink() {
        const drink = new PIXI.Graphics();

        const waveAmplitudeBase = 40 * this.scaleFactor;
        const waveFrequencyBase = 0.002 / this.scaleFactor;
        const rectWidth = 1688 * this.scaleFactor;
        const rectHeight = 1017 * this.scaleFactor;

        let waveAmplitude = waveAmplitudeBase;
        let waveFrequency = waveFrequencyBase;
        let waveOffset = 0;

        const drawWave = () => {
            drink.clear();
            drink.beginFill(`0x${$style.main}`);

            drink.moveTo(0, 0);
            for (let x = 0; x <= rectWidth; x++) {
                let y = (-Math.sin((x * waveFrequency) + waveOffset) * waveAmplitude) - rectHeight + waveAmplitudeBase;
                drink.lineTo(x, y);
            }
            drink.lineTo(rectWidth, 0);
            drink.lineTo(rectWidth, rectHeight);
            drink.lineTo(0, rectHeight);
            drink.closePath();
            drink.endFill();
        };
        const updateWave = () => {
            waveOffset += 0.02;
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



        drink.alpha = 0.33;
        drink.x = 34 * this.scaleFactor;
        drink.y = (97 * this.scaleFactor) + rectHeight + (rectHeight * 0.0);

        /*setTimeout(() => {
            gsap.to(drink, {
                pixi: { y: (97 * this.scaleFactor) + rectHeight + (+ rectHeight * 0.2) },
                duration: 5,
                repeat: 0,
                ease: "none"
            });
        }, 5000)*/

        this.container.addChild(drink);
    }

    createMasks() {
        let xGap = 34;

        this.setMask(xGap);
        for (let i = 0; i < 5; i++) {
            this.setMask(xGap);
            xGap+= 320 + 22;
        }

        this.container.mask = this.maskContainer;
        this.container.addChild(this.maskContainer);
    }

    setMask(xGap) {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(xGap * this.scaleFactor, 97 * this.scaleFactor, 323 * this.scaleFactor, 1017 * this.scaleFactor);
        mask.endFill();
        this.maskContainer.addChild(mask);
    }

    createBubbleEmitter() {
        const bubbleRect = new PIXI.Graphics();
        bubbleRect.beginFill(0xffffff);
        bubbleRect.drawRect(34 * this.scaleFactor, 97 * this.scaleFactor, this.maskContainer.width, this.maskContainer.height);
        bubbleRect.endFill();
        bubbleRect.alpha = 0;
        this.emitterContainer.addChild(bubbleRect);

        const tempContainer = new PIXI.Container();
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(34 * this.scaleFactor, (97 * this.scaleFactor) + (40 * 2 * this.scaleFactor), this.maskContainer.width, this.maskContainer.height - (40 * 2 * this.scaleFactor));
        mask.endFill();
        tempContainer.addChild(mask);
        this.emitterContainer.mask = tempContainer;
        this.emitterContainer.addChild(tempContainer);

        this.container.addChild(this.emitterContainer);

        // TODO emitter with * this.scaleFactor ?

        this.emitter = new Emitter(
            this.emitterContainer,
            {
                "lifetime": {
                    "min": 0.2,
                    "max": 0.3
                },
                "frequency": 0.005,
                "emitterLifetime": 0,
                "maxParticles": 500,
                "addAtBack": false,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "behaviors": [
                    {
                        "type": "textureRandom",
                        "config": {
                            "textures": [
                                $globals.assets.ui['BubbleImage']
                            ]
                        }
                    },
                    {
                        "type": "alpha",
                        "config": {
                            "alpha": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.33
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
                            "min": 600,
                            "max": 800
                        }
                    },
                    {
                        "type": "scale",
                        "config": {
                            "scale": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.2
                                    },
                                    {
                                        "time": 1,
                                        "value": 0.3
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
                            "minStart": 260,
                            "maxStart": 280
                        }
                    },
                    {
                        "type": "spawnShape",
                        "config": {
                            "type": "rect",
                            "data": {
                                "x": 0,
                                "y": this.emitterContainer.height + (100 * this.scaleFactor),
                                "w": this.emitterContainer.width,
                                "h": 0
                            }
                        }
                    }
                ]
            });
    }

    update(dt) {
        if (this.emitter) {
            this.emitter.update(dt * 0.001);
        }
    }
}