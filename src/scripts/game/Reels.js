import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";
import { getCryptoRandomNumber} from "../system/utils.js";
import { getRandomLose, getRandomWinMap } from "../system/math.js";

export class Reels {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;

        this.xPos = 0;
        this.xPosIncrement = $configs.SYMBOL_SIZE - 99;
        this.container = new PIXI.Container();
        this.reels = [];
        this.indexes = {
            REEL_1: null,
            REEL_2: null,
            REEL_3: null,
            REEL_4: null,
            REEL_5: null
        };
        this.lastSymbol = null;

        this.playConfig = { duration: 6, revolutions: 4, ease: 'power2.inOut' };
        this.playConfig.onComplete = () => {
            //mixerAudio.slotTickFX.play();
            this.onComplete();
        }

        this.createReels();
    }

    createReels() {
        for (let i = 1; i <= $configs.REELS; i++) {
            const reel = new Reel(this.scaleFactor, i, this.xPos);
            this.container.addChild(reel.container);
            this.reels.push(reel);

            this.xPos += this.xPosIncrement;
        }
    }

    getConditionAndSymbol() {
        $configs.SELECTED_CONDITION = 'win'//$configs.CONDITIONS[getCryptoRandomNumber(0, $configs.CONDITIONS.length - 1)];

        switch ($configs.SELECTED_CONDITION) {
            case 'lose':
                this.indexes = getRandomLose(this.indexes);

                return;
            case 'fake-win':
            case 'win':
                $configs.SELECTED_SYMBOL = $configs.SYMBOLS[getCryptoRandomNumber(0, $configs.SYMBOLS.length - 1)];
                break;
            case 'mega-win':
                const symbolsWithNoJolly = [...$configs.SYMBOLS, $configs.MEGA_WIN];
                $configs.SELECTED_SYMBOL = $configs.SYMBOLS[getCryptoRandomNumber(0, symbolsWithNoJolly.length - 1)];
        }

        console.log('SYMBOLS - - - - -', $configs.SELECTED_SYMBOL)

        for (let i = 0; i < $configs.REELS; i++) {
            const reelNumber = i + 1;
            this.indexes[`REEL_${reelNumber}`] = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);
        }

        this.indexes = getRandomWinMap(this.indexes);
    }

    play() {
        for (let i = 0; i < $configs.REELS; i++) {
            const reelNumber = i + 1;

            if (this.lastSymbol) {
                const indexOfSelectedSymbol = $configs.MAP[`REEL_${reelNumber}`].indexOf(this.lastSymbol);

                this.reels[i].symbols[indexOfSelectedSymbol].stop();
                this.reels[i].symbols[indexOfSelectedSymbol].currentFrame = 29;
            }

            this.reels[i].animation.toIndex(this.indexes[`REEL_${reelNumber}`], this.playConfig);
        }
    }

    onComplete() {
        // TODO animate on last reel complete

        if ($configs.SELECTED_CONDITION === 'win') {
            for (let i = 0; i < $configs.REELS; i++) {
                const reelNumber = i + 1;
                const indexOfSelectedSymbol = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);

                this.reels[i].symbols[indexOfSelectedSymbol].play();
                this.lastSymbol = $configs.SELECTED_SYMBOL;
            }
        }
    }
}

