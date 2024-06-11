import * as PIXI from "pixi.js";
import { $configs } from "../system/SETUP.js";
import { Reel } from "./Reel.js";
import { getCryptoRandomNumber, getPseudoRandomNumber } from "../system/utils.js";
import { getFakeWin, getLose, getRandomWinMap} from "../system/math.js";
import { $globals } from "../system/utils.js";
import { gsap } from "gsap";

export class Reels {

    constructor(scaleFactor) {
        this.EE = new PIXI.utils.EventEmitter();
        this.scaleFactor = scaleFactor;
        this.isPlaying = false;
        this.isFastForwardActive = false;

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
                $configs.SELECTED_SYMBOL = null;
                this.indexes = getLose(this.indexes);
                break;
            case 'fake-win':
                $configs.SELECTED_SYMBOL = null;
                this.indexes = getFakeWin(this.indexes);
                break;
            case 'win':
                $configs.SELECTED_SYMBOL = $configs.SYMBOLS[getCryptoRandomNumber(0, $configs.SYMBOLS.length - 1)];

                for (let i = 0; i < $configs.REELS; i++) {
                    const reelNumber = i + 1;
                    this.indexes[`REEL_${reelNumber}`] = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);
                }

                if (this.isJollyTime()) {
                    $configs.JOLLY_REEL = getPseudoRandomNumber(1, $configs.REELS);
                    this.indexes[`REEL_${$configs.JOLLY_REEL}`] = $configs.MAP[`REEL_${$configs.JOLLY_REEL}`].indexOf($configs.JOLLY);
                }

                this.indexes = getRandomWinMap(this.indexes);
                break;
            case 'mega-win':
                $configs.SELECTED_SYMBOL = $configs.MEGA_WIN;

                for (let i = 0; i < $configs.REELS; i++) {
                    const reelNumber = i + 1;
                    this.indexes[`REEL_${reelNumber}`] = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);
                }

                this.indexes = getRandomWinMap(this.indexes);
        }
    }
    isJollyTime() {
        const temp = $configs.JOLLY_RATIO[getCryptoRandomNumber(0, $configs.JOLLY_RATIO.length - 1)];

        if (temp === 0) return false;
        if (temp === 1) return true;
    }

    reset() {
        for (let i = 0; i < $configs.REELS; i++) {
            const reelNumber = i + 1;

            if (this.lastSymbol) {
                if ($configs.JOLLY_REEL && $configs.JOLLY_REEL === reelNumber) {
                    const jollyIndex = $configs.MAP[`REEL_${$configs.JOLLY_REEL}`].indexOf($configs.JOLLY);
                    this.reels[$configs.JOLLY_REEL - 1].symbols[jollyIndex].stop();
                    this.reels[$configs.JOLLY_REEL - 1].symbols[jollyIndex].currentFrame = 29;
                } else {
                    const indexOfSelectedSymbol = $configs.MAP[`REEL_${reelNumber}`].indexOf(this.lastSymbol);
                    this.reels[i].symbols[indexOfSelectedSymbol].stop();
                    this.reels[i].symbols[indexOfSelectedSymbol].currentFrame = 29;
                }
            }
        }

        $configs.JOLLY_REEL = null;
    }

    play() {
        this.isPlaying = true;
        $globals.assets.audio['SlotClickSfx'].play();

        const animDuration = getPseudoRandomNumber(30, 50) / 10;
        const newAnimDuration = !this.isFastForwardActive ? animDuration : (animDuration / 2); // play speed x2

        let animRevolution = getPseudoRandomNumber(19, 21);
        animRevolution = Math.floor((animRevolution / animDuration) * newAnimDuration); // revolutions sync with animation duration

        for (let i = 0; i < $configs.REELS; i++) {
            const reelNumber = i + 1;

            this.reels[i].animation.toIndex(this.indexes[`REEL_${reelNumber}`], this.animConfig(reelNumber, newAnimDuration, animRevolution));
        }
    }

    animConfig(reelNumber, duration, revolution) {
        let animDelay;
        switch (reelNumber) {
            case 1:
                animDelay = 0;
                break;
            case 2:
                animDelay = !this.isFastForwardActive ? 0.10 : 0.05;
                break;
            case 3:
                animDelay = !this.isFastForwardActive ? 0.20 : 0.10;
                break;
            case 4:
                animDelay = !this.isFastForwardActive ? 0.40 : 0.20;
                break;
            case 5:
                animDelay = !this.isFastForwardActive ? 0.80 : 0.40;
        }

        return {
            duration: duration + animDelay,
            revolutions: revolution,
            ease: 'power2.inOut',
            onComplete: () => {
                $globals.assets.audio['SlotTickSfx'].play();

                if (reelNumber === 5) this.onComplete();
            }
        };
    }

    onComplete() {
        this.isPlaying = false;
        this.EE.emit('animationComplete');

        if ($configs.SELECTED_CONDITION === 'win' || $configs.SELECTED_CONDITION === 'mega-win') {
            for (let i = 0; i < $configs.REELS; i++) {
                const reelNumber = i + 1;

                if ($configs.JOLLY_REEL && $configs.JOLLY_REEL === reelNumber) {
                    const jollyIndex = $configs.MAP[`REEL_${$configs.JOLLY_REEL}`].indexOf($configs.JOLLY);
                    this.reels[$configs.JOLLY_REEL - 1].symbols[jollyIndex].play();
                } else {
                    const indexOfSelectedSymbol = $configs.MAP[`REEL_${reelNumber}`].indexOf($configs.SELECTED_SYMBOL);
                    this.reels[i].symbols[indexOfSelectedSymbol].play();
                }
            }

            this.lastSymbol = $configs.SELECTED_SYMBOL;
        }
    }
}

