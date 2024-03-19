import * as PIXI from "pixi.js";
import { $style } from "../system/SETUP.js";
import { Drink } from "../game/Drink.js";
import { isMobile } from "../system/utils.js";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this.scaleFactor = null;

        this.createText();
    }

    createText() {
        const text = new PIXI.Text();
        text.x = window.innerWidth / 2;
        text.y = window.innerHeight / 2;
        text.anchor.set(0.5);
        text.style = {
            fontFamily: 'Rimbo-Regular',
            fontSize: 50,
            fill: '#ffffff'//[`#${$style.textColor}`]
        };
        text.text = 'Loading';

        this.container.addChild(text);
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
        console.log('RESIZE !!! TODO ...')

        if (isMobile) {
            this.scaleFactor = window.innerWidth / originalRect.w;
        }
        if (!isMobile) {
            this.scaleFactor = window.innerHeight / originalRect.h;
        }
    }

    update(dt) {
        if (this.drink) {
            this.drink.update(dt);
        }
    }
}