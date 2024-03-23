import * as PIXI from "pixi.js";
import { $style } from "../system/SETUP.js";
import { Drink } from "../game/Drink.js";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this.scaleFactor = null;
    }

    createText() {
        this.text = new PIXI.Text();
        this.text.style = {
            fontFamily: 'Rimbo-Regular',
            fontSize: 50,
            fill: [`#${$style.white}`]
        };
        this.text.text = 'Loading';

        this.text.anchor.set(0.5);
        this.text.x = window.innerWidth / 2;
        this.text.y = window.innerHeight / 2;

        this.container.addChild(this.text);
    }

    createDrink() {
        this.drink = new Drink(this.scaleFactor, true);
        this.drink.resetLevel();
        this.container.addChild(this.drink.container);
    }
    setLevel(level) {
        this.drink.setLevel(level);
    }

    resize(originalRect) {
        const scaleFactorHeight = window.innerHeight / originalRect.h;
        const scaleFactorWidth = window.innerWidth / originalRect.w;
        this.scaleFactor = Math.max(scaleFactorHeight, scaleFactorWidth);

        if (this.text) {
            this.text.x = window.innerWidth / 2;
            this.text.y = window.innerHeight / 2;
        }
        if (this.drink) {
            this.drink.container.scale.set(this.scaleFactor);
        }
    }

    update(dt) {
        if (this.drink) {
            this.drink.update(dt);
        }
    }
}