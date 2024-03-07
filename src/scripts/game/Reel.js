import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { $configs } from "../system/SETUP.js";
import { verticalLoop } from "../system/math.js";
import { getPseudoRandomNumber } from "../system/utils.js";

export class Reel {
    constructor(scaleFactor, index, xPos) {
        this.SYMBOL_SIZE = $configs.SYMBOL_SIZE;
        this.scaleFactor = scaleFactor;
        this.index = index;
        this.xPos = xPos;
        this.xGap = -23;
        this.yGap = 92;

        this.self = null;

        this.container = new PIXI.Container()

        this.createReel();
        this.setPosition();
        this.containerDimension = {
            height: this.container.height,
            width: this.container.width
        }
        this.setMask();

        this.wrapHeights = Array($configs.REEL_LENGTH).fill((this.SYMBOL_SIZE - this.yGap) * this.scaleFactor);
        this.animation = this.verticalLoop();

        console.log('WRAP H', this.wrapHeights, this.scaleFactor)


        const animConfig = { duration: 6, revolutions: 4, ease: 'power2.inOut' };
        animConfig.onComplete = () => {
            //mixerAudio.slotTickFX.play();
            //if (i === 5) this.onComplete();
        }



        window.addEventListener('click', () => {
            this.animation.toIndex(getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1), animConfig);
        });
    }

    createReel() {
        this.self = {
            container: this.container,
            symbols: [],
            //blur: new PIXI.BlurFilter(),
        };

        //reel.blur.blurX = 0;
        //reel.blur.blurY = 0;
        //this.container.filters = [reel.blur];

        for (let i = 0; i < $configs.REEL_LENGTH; i++) {
            let assetName = $configs.MAP[`REEL_${this.index}`][i];
            assetName = assetName[0].toUpperCase() + assetName.substring(1) + 'Sprite';

            const textures = Object.values($globals.assets.symbols[assetName].textures);

            const symbol = new PIXI.AnimatedSprite(textures);
            symbol.currentFrame = 29; // character has more frames


            symbol.y = ((i * this.SYMBOL_SIZE) - (i * this.yGap)) * this.scaleFactor;
            symbol.width = this.SYMBOL_SIZE * this.scaleFactor;
            symbol.height = this.SYMBOL_SIZE * this.scaleFactor;
            symbol.x = this.xGap * this.scaleFactor;
            this.self.symbols.push(symbol);
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
        mask.drawRect(34 * this.scaleFactor, 76 * this.scaleFactor, (this.SYMBOL_SIZE - 116) * this.scaleFactor, ((this.SYMBOL_SIZE * 3) - 304) * this.scaleFactor);
        mask.endFill();
        this.container.mask = mask; // TODO check
        this.container.addChild(mask);
    }

    verticalLoop() {
        const gap = Math.abs(this.xGap * 2 * this.scaleFactor);
        return verticalLoop(this.self.symbols, this.containerDimension, this.wrapHeights, gap, {
            repeat: -1,
            paused: true,
            center: true,
        });
    }
}