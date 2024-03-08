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

        function draw() {
            drink.clear();
            drink.beginFill(0xff0000);
            //drink.drawRect(34 * this.scaleFactor, 97 * this.scaleFactor, 1688 * this.scaleFactor, 1017 * this.scaleFactor);


            let waveAmplitude = 100 * this.scaleFactor;
            let waveLength = 50 * this.scaleFactor;
            let rectWidth = 1688 * this.scaleFactor;
            let rectHeight = (1017 * this.scaleFactor) / 2;

            drink.moveTo(0, 0);
            for(let x = 0; x <= rectWidth; x += waveLength) {
                let y = Math.sin((x / rectWidth) * 2 * Math.PI) * waveAmplitude;
                drink.lineTo(x, y);
            }

            drink.lineTo(rectWidth, 0);
            drink.lineTo(rectWidth, rectHeight);
            drink.lineTo(0, rectHeight);
            drink.closePath();
        }
        draw();


        //drink.alpha = 0.2;
        drink.endFill();
        drink.x = 34 * this.scaleFactor;
        drink.y = (97 * this.scaleFactor) + ((1017 * this.scaleFactor) / 2);

        this.container.addChild(drink);


        /*gsap.to(drink, {
            pixi: {
                //x: "+=" + Math.PI * 2
            },
            onRepeat: () => {
                draw();
            },
            duration: 2,
            repeat: -1,
            ease: 'none'
        });*/
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
        mask.drawRect(xGap * this.scaleFactor, 97 * this.scaleFactor, 320 * this.scaleFactor, 1017 * this.scaleFactor);
        mask.endFill();
        this.maskContainer.addChild(mask);
    }
}