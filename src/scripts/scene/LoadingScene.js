import * as PIXI from "pixi.js";
import { $style } from "../system/SETUP.js";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this.createText();
    }

    createText() {
        const text = new PIXI.Text();
        //text.x = window.innerWidth / 2;
        //text.y = window.innerHeight / 2;
        //text.anchor.set(0.5);
        text.style = {
            fontFamily: 'Rimbo-Regular',
            fontSize: 30,
            fill: '#000000'//[`#${$style.textColor}`]
        };
        text.text = 'Loading...';

        this.container.addChild(text);
    }

    resize() {
        //
    }
}