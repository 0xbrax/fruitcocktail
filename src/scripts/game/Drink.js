import * as PIXI from "pixi.js";
import { gsap } from 'gsap';
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
        this.rectHeight = 1017 * this.scaleFactor;

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

    createBubbleEmitter() {
        this.elapsedTime = 0;
        const texture = PIXI.Texture.from('./bubble_64x64.png'); // TODO move assets to public ??

        const particlesCount = 50;
        const particlePositions = new Float32Array(particlesCount * 2);
        const yPositions = [];
        const particleSizes = new Float32Array(particlesCount);
        const particleSpeeds = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            const i2 = i * 2;
            particlePositions[i2] = (Math.random() * this.maskContainer.width) + (this.xPos * this.scaleFactor);
            particlePositions[i2 + 1] = (Math.random() * this.maskContainer.height) + (this.yPos * this.scaleFactor);
            yPositions[i] = particlePositions[i2 + 1];

            particleSizes[i] = Math.random() * 0.5 + 0.5;
            particleSpeeds[i] = Math.random() * 0.5 + 0.5;
        }

        const maxY = Math.max(...yPositions);

        const particleGeometry = new PIXI.Geometry()
            .addAttribute('aPosition', particlePositions, 2)
            .addAttribute('aSize', particleSizes, 1)
            .addAttribute('aSpeed', particleSpeeds, 1)

        this.bubbleShader = PIXI.Shader.from(
            bubbleVertexShader,
            bubbleFragmentShader,
            {
                uTime: 0,
                uScale: this.scaleFactor,
                uTexture: texture,
                uMaxY: maxY
            }
        );

        const particleMesh = new PIXI.Mesh(particleGeometry, this.bubbleShader);
        particleMesh.drawMode = PIXI.DRAW_MODES.POINTS;

        particleMesh.y = 40 * 5 * this.scaleFactor;
        this.emitterContainer.addChild(particleMesh);
        this.container.addChild(this.emitterContainer);
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
        this.bubbleShader.uniforms.uScale = scaleFactor;
    }

    update(dt) {
        this.updateWave();
        
        this.elapsedTime += dt;
        this.bubbleShader.uniforms.uTime = this.elapsedTime;
    }
}