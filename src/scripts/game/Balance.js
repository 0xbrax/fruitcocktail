import * as PIXI from "pixi.js";
import { SimpleSprite } from "./SimpleSprite.js";
import { $style } from "../system/SETUP.js";
import { $configs } from "../system/SETUP.js";

export class Balance extends SimpleSprite {
    constructor(scaleFactor, bodyContainer) {
        const xGap = 105 * scaleFactor;

        super("BalanceImage", scaleFactor + (0.15 * scaleFactor), bodyContainer, 71, xGap);

        this.sprite.rotation = -0.07;
        this.setText();
    }

    setText() {
        this.text = new PIXI.Text();
        this.text.style = {
            fontFamily: 'Rimbo-Regular',
            fontSize: 62 * this.scaleFactor,
            fill: `#${$style.white}`
        };
        this.text.text = $configs.USER.BALANCE;

        this.text.anchor.set(1);
        this.text.x = this.sprite.width + (57 * this.scaleFactor);
        this.text.y = (this.sprite.height / 2) - (this.text.height) + (3 * this.scaleFactor);
        this.text.rotation = -0.07;

        this.container.addChild(this.text);
    }
}