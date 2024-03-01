import * as PIXI from "pixi.js";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this.createText();
    }

    createText() {
        const text = new PIXI.Text();
        text.x = window.innerWidth / 2;
        text.y = (window.innerHeight / 2);
        text.anchor.set(0.5);
        text.style = {
            fontWeight: 'normal',
            fontSize: 30,
            fill: ['#FFFFFF']
        };
        text.text = 'Restart';

        this.container.addChild(text);
    }
}