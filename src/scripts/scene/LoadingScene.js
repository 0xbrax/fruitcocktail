import { $style } from "../system/SETUP.js";
import { DISCLAIMER_TEXT } from "../system/SETUP.js";
import { $globals, isMobile } from "../system/utils.js";

export class LoadingScene {
    constructor() {
        this.createBackground();
        this.createText();
    }

    createBackground() {
        this.background = document.createElement('div');
        this.background.style.width = '100%';
        this.background.style.height = '100%';
        this.background.style.position = 'absolute';
        this.background.style.zIndex = '100';
        this.background.style.top = '0';
        this.background.style.left = '0';
        this.background.style.overflow = 'hidden';
        this.background.style.backgroundColor = `#${$style.black}`;
        this.background.style.textAlign = 'center';
        this.background.style.alignContent = 'center';

        this.background.innerHTML = `
            <img style="width: ${isMobile ? '75%' : '25%'}; margin-bottom: 50px;" src="${$globals.assets.preload['LogoFullImage']}" alt="" />
        `;

        document.body.appendChild(this.background);
    }

    createText() {
        this.text = document.createElement('div');

        this.content = document.createElement('span');
        const contentStyle = {
            display: 'inline-block',
            fontFamily: 'Rimbo-Regular',
            fontSize: '50px',
            color: `#${$style.white}`,
            border: `5px solid #${$style.white}`,
            borderRadius: '10px',
            width: '250px',
            height: '100px',
            alignContent: 'center'
        };
        Object.assign(this.content.style, contentStyle);
        this.text.appendChild(this.content);

        this.background.appendChild(this.text);
    }

    setText(text) {
        this.content.innerHTML = text;

        if (!isNaN(text)) {
            this.content.style.background = `linear-gradient(0deg, rgba(${$style.mainRGB}, 1) ${text}%, rgba(0, 0, 0, 0) ${text}%)`;
        }
    }

    createDisclaimer() {
        this.disclaimer = document.createElement('div');
        this.disclaimer.id = 'disclaimer';
        const style = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: '101',
            top: '0',
            left: '0',
            padding: isMobile ? '25px' : '100px',
            textAlign: 'center',
            alignContent: 'center',
            overflow: 'auto',
            scrollBehavior: 'smooth',
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

    remove() {
        this.background.remove();
    }
}