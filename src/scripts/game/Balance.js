import * as PIXI from "pixi.js";
import { SimpleSprite } from "./SimpleSprite.js";
import { $style } from "../system/SETUP.js";
import { $configs } from "../system/SETUP.js";

export class Balance extends SimpleSprite {
    constructor(scaleFactor, bodyContainer) {
        const xGap = 65 * scaleFactor;

        super("BalanceImage", scaleFactor + 0.15, bodyContainer, 73, xGap);

        this.sprite.rotation = -0.07;

        this.setText();

        setInterval(() => {
            //$configs.USER.BALANCE += $configs.USER.BET_INCREMENT;
            this.text.text = $configs.USER.BALANCE;
        }, 1_000)
    }

    setText() {
        this.text = new PIXI.Text();
        this.text.style = {
            fontFamily: 'Rimbo-Regular',
            fontSize: 40,
            fill: `#${$style.white}`
        };
        this.text.text = $configs.USER.BALANCE;

        this.text.anchor.set(1);
        this.text.x = this.sprite.width + 8;
        this.text.y = (this.sprite.height / 2) - (this.text.height) + 3;
        this.text.rotation = -0.07;

        this.container.addChild(this.text);
    }
}