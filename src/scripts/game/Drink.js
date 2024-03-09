import * as PIXI from "pixi.js";
import { gsap } from 'gsap';

export class Drink {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;
        this.container = new PIXI.Container();
        this.maskContainer = new PIXI.Container();

        this.createDrink();
        this.createMasks();
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
            drink.beginFill(0xff0000);

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



        //drink.alpha = 0.2;
        drink.x = 34 * this.scaleFactor;
        drink.y = (97 * this.scaleFactor) + rectHeight + (+ rectHeight * 0.8);

        setTimeout(() => {
            gsap.to(drink, {
                pixi: { y: (97 * this.scaleFactor) + rectHeight + (+ rectHeight * 0.2) },
                duration: 5,
                repeat: 0,
                ease: "none"
            });
        }, 5000)

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
}