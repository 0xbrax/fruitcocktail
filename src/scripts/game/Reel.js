import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { $configs } from "../system/SETUP.js";

export class Reel {
    constructor(scaleFactor, index, xPos) {
        this.SYMBOL_SIZE = 440;
        this.scaleFactor = scaleFactor;
        this.index = index;
        this.xPos = xPos;
        this.xGap = 0;
        this.yGap = 290;

        this.container = new PIXI.Container();

        this.createReel();
        this.setPosition();
        this.setMask();
    }

    createReel() {
        const reel = {
            container: this.container,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.BlurFilter(),
        };

        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        this.container.filters = [reel.blur];

        for (let i = 0; i < $configs.REEL_LENGTH; i++) {
            let assetName = $configs.MAP[`REEL_${this.index}`][i];
            assetName = assetName[0].toUpperCase() + assetName.substring(1) + 'Sprite';
            const symbol = $globals.assets.symbols[assetName];

            symbol.y = (i * this.SYMBOL_SIZE) - (i * this.yGap);
            symbol.width = this.SYMBOL_SIZE * this.scaleFactor;
            symbol.height = this.SYMBOL_SIZE * this.scaleFactor;
            symbol.x = this.xGap;//this.xGap; //Math.round((this.SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }

    setPosition() {
        this.container.y = 9;
        this.container.x = this.xPos;
    }

    setMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(this.container.x, this.container.y, this.SYMBOL_SIZE, (this.SYMBOL_SIZE * 3) - ((this.yGap * 3) - this.container.y));
        mask.endFill();
        this.container.mask = mask; // TODO check
        this.container.addChild(mask);
    }
}