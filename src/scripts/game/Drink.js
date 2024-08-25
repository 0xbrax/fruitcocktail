import * as PIXI from "pixi.js";
import { gsap } from 'gsap';
import { Emitter } from "@pixi/particle-emitter";
import { $globals } from "../system/utils.js";
import { $style } from "../system/SETUP.js";

import bubbleVertexShader from '../../shaders/bubble/vertex.glsl'
import bubbleFragmentShader from '../../shaders/bubble/fragment.glsl'

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
        //this.createBubbleEmitter();






        this.elapsedTime = 0;
        const texture = PIXI.Texture.from('./bubble_64x64.png'); // TODO move assets to public ??

        const particleCount = 100;
        const particlePositions = new Float32Array(particleCount * 2);
        const yPositions = [];
        const sizesArray = new Float32Array(particleCount);
        const particleSpeed = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i2 = i * 2;
            particlePositions[i2] = (Math.random() * this.maskContainer.width) + (this.xPos * this.scaleFactor);
            particlePositions[i2 + 1] = (Math.random() * this.maskContainer.height) + (this.yPos * this.scaleFactor);
            yPositions[i] = particlePositions[i2 + 1];

            sizesArray[i] = Math.random() * 0.5 + 0.5;
            particleSpeed[i] = Math.random() * 0.5 + 0.5;
        }

        const maxY = Math.max(...yPositions);

        const particleGeometry = new PIXI.Geometry()
            .addAttribute('aVertexPosition', particlePositions, 2)
            .addAttribute('aSize', sizesArray, 1)
            .addAttribute('aSpeed', particleSpeed, 1)

        this.shader = PIXI.Shader.from(
            bubbleVertexShader,
            bubbleFragmentShader,
            {
                uTime: 0,
                uScale: this.scaleFactor,
                uTexture: texture,
                uMaxY: maxY
            }
        );

        const particleMesh = new PIXI.Mesh(particleGeometry, this.shader);
        particleMesh.drawMode = PIXI.DRAW_MODES.POINTS;

        particleMesh.y = 40 * 5 * this.scaleFactor;
        this.emitterContainer.addChild(particleMesh);
        this.container.addChild(this.emitterContainer);
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
            //this.drink.beginFill('#ff0000'); // TODO # instead 0x

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
        this.updateWave = () => {
            waveOffset += 0.03;
            waveAmplitude = waveAmplitudeBase + (Math.sin(waveOffset) * 5 * this.scaleFactor);
            waveFrequency = waveFrequencyBase + (Math.sin(waveOffset / 2) * 0.002 * this.scaleFactor);
            drawWave();
        };

        drawWave();

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
        //this.createBubbleContainer();

        const textures = [$globals.assets.body['BubbleImage']];

        this.emitter = new Emitter(
            this.emitterContainer,
        {
            "lifetime": {
                "min": 0.2,
                "max": 0.4
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
                                    "value": 0.6 * this.scaleFactor
                                },
                                {
                                    "time": 1,
                                    "value": 0.8 * this.scaleFactor
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

    resize(scaleFactor) {
        this.shader.uniforms.uScale = scaleFactor;
    }

    update(dt) {
        this.updateWave();
        /*if (this.emitter.emit === true) {
            this.emitter.update(dt * this.bubbleSpeed);
        }*/



        this.elapsedTime += dt;
        this.shader.uniforms.uTime = this.elapsedTime;
    }
}