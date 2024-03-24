import * as PIXI from "pixi.js";
import { $style } from "../system/SETUP.js";
import { Drink } from "../game/Drink.js";
import { DISCLAIMER_TEXT } from "../system/SETUP.js";
import { $globals, isMobile } from "../system/utils.js";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this.subContainer =  new PIXI.Container();
        this.subContainer.sortableChildren = true;
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
        this.text.y = this.logo.height + this.text.height;
        this.text.zIndex = 2;

        this.subContainer.addChild(this.text);
    }
    createTextBackground() {
        this.textBakcground = new PIXI.Graphics();
        this.textBakcground.beginFill(`0x${$style.secondary}`);
        this.textBakcground.drawRoundedRect((this.text.x - (this.text.width / 2)) - 30, (this.text.y - (this.text.height / 2)) - 15, this.text.width + 60, this.text.height + 30, 15);
        this.textBakcground.endFill();
        this.textBakcground.zIndex = 1;

        this.subContainer.addChild(this.textBakcground);
    }
    createLogo() {
        this.logo = new PIXI.Sprite($globals.assets.other['LogoFullImage']);

        let scaleFactor;
        if (isMobile) {
            scaleFactor = (window.innerWidth * 0.8) / this.logo.width;

            this.logo.height *= scaleFactor;
            this.logo.width *= scaleFactor;
        }
        if (!isMobile) {
            scaleFactor = (window.innerWidth * 0.3) / this.logo.width;

            this.logo.height *= scaleFactor;
            this.logo.width *= scaleFactor;
        }

        this.logo.x = (window.innerWidth / 2) - (this.logo.width / 2);
        this.logo.y = 0;

        this.subContainer.addChild(this.logo);
    }
    setSubContainerPosition() {
        this.subContainer.y = (window.innerHeight / 2) - (this.subContainer.height / 2);
        this.subContainer.x = 0;
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
            padding: isMobile ? '25px' : '250px',
            overflow: 'auto',
            scrollBehavior: 'smooth',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: `#${$style.white}`,
        };

        const textStyle = {
            'font-family': 'sans-serif',
            'font-size': '20px',
            'line-height': '25px',
            'text-align': 'justify',
            'margin-top': '30px',
        };
        const textStyleString = Object.entries(textStyle)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ');
        const newText = DISCLAIMER_TEXT.replaceAll(/\n/g, '<br>');

        this.disclaimer.innerHTML = `
            <i-heroicons icon-name="check"></i-heroicons>
        
            <div style="${textStyleString}">
                ${newText}
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

        if (this.drink) {
            this.drink.container.scale.set(this.scaleFactor);
        }

        this.scaleFactor = Math.min(scaleFactorHeight, scaleFactorWidth);

        this.subContainer.scale.set(this.scaleFactor);
        this.setSubContainerPosition();
    }

    update(dt) {
        if (this.drink) {
            this.drink.update(dt);
        }
    }
}