import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";
import { getCryptoRandomNumber} from "../system/utils.js";
import { getFakeWin, getLose, getRandomWinMap} from "../system/math.js";
import { $globals } from "../system/utils.js";
import SlotClickSfx from "../../assets/audio/slot_click_COMPRESSED.mp3";

export class Reels extends PIXI.utils.EventEmitter {
    constructor(scaleFactor) {
        super();
        this.scaleFactor = scaleFactor;
        this.isPlaying = false;

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
        $configs.SELECTED_CONDITION = $configs.CONDITIONS[getCryptoRandomNumber(0, $configs.CONDITIONS.length - 1)];

        switch ($configs.SELECTED_CONDITION) {
            case 'lose':
                this.indexes = getLose(this.indexes);
                break;
            case 'fake-win':
                this.indexes = getFakeWin(this.indexes);
                break;
            case 'win':
                // TODO JOLLY

                $configs.SELECTED_SYMBOL = $configs.SYMBOLS[getCryptoRandomNumber(0, $configs.SYMBOLS.length - 1)];

                for (let i = 0; i < $configs.REELS; i++) {
                    const reelNumber = i + 1;
                    this.indexes[`REEL_${reelNumber}`] = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);
                }

                this.indexes = getRandomWinMap(this.indexes);
                break;
            case 'mega-win':
                // TODO JOLLY

                $configs.SELECTED_SYMBOL = $configs.MEGA_WIN;

                for (let i = 0; i < $configs.REELS; i++) {
                    const reelNumber = i + 1;
                    this.indexes[`REEL_${reelNumber}`] = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);
                }

                this.indexes = getRandomWinMap(this.indexes);
        }
    }
    jollyHandler() {
        //JOLLY_RATIO
    }

    play() {
        this.isPlaying = true;
        $globals.assets.audio['SlotClickSfx'].play();

        for (let i = 0; i < $configs.REELS; i++) {
            const reelNumber = i + 1;

            if (this.lastSymbol) {
                const indexOfSelectedSymbol = $configs.MAP[`REEL_${reelNumber}`].indexOf(this.lastSymbol);

                this.reels[i].symbols[indexOfSelectedSymbol].stop();
                this.reels[i].symbols[indexOfSelectedSymbol].currentFrame = 29;
            }

            this.reels[i].animation.toIndex(this.indexes[`REEL_${reelNumber}`], this.animConfig(reelNumber));
        }
    }

    animConfig(reelNumber) {
        return {
            duration: 6,
            revolutions: 4,
            ease: 'power2.inOut',
            onComplete: () => {
                $globals.assets.audio['SlotTickSfx'].play();

                if (reelNumber === 5) this.onComplete();
            }
        };
    }

    onComplete() {
        this.isPlaying = false;
        this.emit('animationComplete');

        if ($configs.SELECTED_CONDITION === 'win' || $configs.SELECTED_CONDITION === 'mega-win') {
            for (let i = 0; i < $configs.REELS; i++) {
                const reelNumber = i + 1;
                const indexOfSelectedSymbol = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);

                this.reels[i].symbols[indexOfSelectedSymbol].play();
                this.lastSymbol = $configs.SELECTED_SYMBOL;
            }
        }
    }
}

