import * as PIXI from "pixi.js";
import { $style } from "../system/SETUP.js";
import { Drink } from "../game/Drink.js";
import { DISCLAIMER_TEXT } from "../system/SETUP.js";
import { isMobile } from "../system/utils.js";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this.scaleFactor = null;
    }

    setText(text) {
        this.text = new PIXI.Text();
        this.text.style = {
            fontFamily: 'Rimbo-Regular',
            fontSize: 50,
            fill: `#${$style.white}`
        };
        this.text.text = text;

        this.text.anchor.set(0.5);
        this.text.x = window.innerWidth / 2;
        this.text.y = window.innerHeight / 2;

        this.container.addChild(this.text);
    }
    createDisclaimer() {
        this.disclaimer = document.createElement('div');
        this.disclaimer.id = 'disclaimer';
        const style = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: '99',
            top: '0',
            left: '0',
            fontFamily: 'sans-serif',
            fontSize: '20px',
            lineHeight: '25px',
            textAlign: 'justify',
            textJustify: 'inter-word',
            padding: isMobile ? '25px' : '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white'
        };

        this.disclaimer.innerHTML = `
            <i-heroicons icon-name="x-mark"></i-heroicons>
        
            <div style="margin-top: 30px">
                ${DISCLAIMER_TEXT}
            </div>
        `;

        Object.assign(this.disclaimer.style, style);
        document.body.appendChild(this.disclaimer);

        this.disclaimer.addEventListener('click', this.disclaimer.remove);
    }

    createDrink() {
        this.drink = new Drink(this.scaleFactor, true);
        this.drink.resetLevel();
        this.container.addChild(this.drink.container);
    }
    updateProgress(level) {
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