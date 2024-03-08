import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { $configs } from "../system/SETUP.js";
import { verticalLoop } from "../system/utils.js";

export class Reel {
    constructor(scaleFactor, index, xPos) {
        this.scaleFactor = scaleFactor;
        this.index = index;
        this.xPos = xPos;
        this.xGap = -23;
        this.yGap = 92;

        this.container = new PIXI.Container();
        this.symbols = [];
        //blur: new PIXI.BlurFilter(),
        //this.container.filters = [reel.blur];

        this.createReel();
        this.setPosition();
        this.containerDimension = {
            height: this.container.height,
            width: this.container.width
        }
        this.setMask();

        this.wrapHeights = Array($configs.REEL_LENGTH).fill(($configs.SYMBOL_SIZE - this.yGap) * this.scaleFactor);
        this.animation = this.verticalLoop();
    }

    createReel() {
        for (let i = 0; i < $configs.REEL_LENGTH; i++) {
            let assetName = $configs.MAP[`REEL_${this.index}`][i];
            assetName = assetName[0].toUpperCase() + assetName.substring(1) + 'Sprite';

            const textures = Object.values($globals.assets.symbols[assetName].textures);

            const symbol = new PIXI.AnimatedSprite(textures);
            symbol.currentFrame = 29;
            symbol.animationSpeed = 0.5;

            symbol.y = ((i * $configs.SYMBOL_SIZE) - (i * this.yGap)) * this.scaleFactor;
            symbol.width = $configs.SYMBOL_SIZE * this.scaleFactor;
            symbol.height = $configs.SYMBOL_SIZE * this.scaleFactor;
            symbol.x = this.xGap * this.scaleFactor;
            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }

    setPosition() {
        this.container.y = 21 * this.scaleFactor;
        this.container.x = this.xPos * this.scaleFactor;
    }

    setMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(34 * this.scaleFactor, 76 * this.scaleFactor, ($configs.SYMBOL_SIZE - 116) * this.scaleFactor, (($configs.SYMBOL_SIZE * 3) - 304) * this.scaleFactor);
        mask.endFill();
        this.container.mask = mask;
        this.container.addChild(mask);
    }

    verticalLoop() {
        const gap = Math.abs(this.xGap * 2 * this.scaleFactor);
        return verticalLoop(this.symbols, this.containerDimension, this.wrapHeights, gap, {
            repeat: -1,
            paused: true,
            center: true,
        });
    }
}