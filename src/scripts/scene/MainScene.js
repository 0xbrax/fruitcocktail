import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";
import { PlayUI } from "../game/PlayUI.js";
import { SettingUI } from "../game/SettingUI.js";
import { isMobile} from "../system/utils.js";
import { $configs, $style } from "../system/SETUP.js";
import { $globals } from "../system/utils.js";
import { Howler } from 'howler';
import { gsap } from 'gsap';
import { Drink } from "../game/Drink.js";
import { Bonus } from "../game/Bonus.js";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();
        this.subContainer = new PIXI.Container();

        this.container.addChild(this.subContainer);



        this.scaleFactor = null;
        this.background = null;
        this.slot = null;
        this.playUI = null;
        this.settingUI = null;
        this.userBet = null;

        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        this.createBackground();
        this.createSlot();
        this.createPlayUI();
        this.createSettingUI();

        $globals.assets.audio['BackgroundMusicTrack'].volume = 0.5;
        $globals.assets.audio['BackgroundMusicTrack'].loop = true;
        $globals.assets.audio['BackgroundMusicTrack'].play();

        this.slot.on('preReady', () => {
            this.playUI.play.element.style.filter = 'grayscale(0)';
        });

        this.playUI.play.element.addEventListener('click', () => {
            if (!this.slot.isReady || this.slot.reels.isPlaying) return;

            if ($configs.USER.BALANCE - $configs.USER.BET < 0) return;
            if ($configs.USER.BALANCE >= 10_000_000) return;

            this.userBet = $configs.USER.BET;
            $configs.USER.BALANCE -= this.userBet;

            this.slot.balance.text.text = $configs.USER.BALANCE;
            this.slot.reels.reset();
            this.slot.reels.getConditionAndSymbol();
            this.slot.reels.play();

            console.log('- - - - - LOG ......', $configs.SELECTED_CONDITION, $configs.SELECTED_SYMBOL)
        });

        this.slot.reels.on('animationComplete', () => {
            let winAmount = 0;
            switch ($configs.SELECTED_CONDITION) {
                case 'lose':
                case 'fake-win':
                    break;
                case 'win':
                    if ($configs.JOLLY_REEL) {
                        winAmount = this.userBet * 3;
                        $configs.USER.BALANCE += winAmount;

                        $globals.assets.audio['SlotWinJollySfx'].play();
                    } else {
                        winAmount = this.userBet * 2;
                        $configs.USER.BALANCE += winAmount;

                        $globals.assets.audio['SlotWinSfx'].play();
                    }

                    this.createWinScreen(winAmount);
                    break;
                case 'mega-win':
                    winAmount = this.userBet * 5;
                    $configs.USER.BALANCE += winAmount;

                    $globals.assets.audio['SlotMegaWinSfx'].play();
                    this.createWinScreen(winAmount);
            }

            this.slot.balance.text.text = $configs.USER.BALANCE;
        });
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            Howler.mute(true);
        } else {
            if ($globals.isAudioActive) {
                Howler.mute(false);
            }
        }
    }

    createBackground() {
        this.background = new Background();
    }
    createSlot() {
        this.slot = new Slot();
        this.subContainer.addChild(this.slot.container);
    }
    createPlayUI() {
        this.playUI = new PlayUI();
    }
    createSettingUI() {
        this.settingUI = new SettingUI();
    }
    createWinScreen(winAmount) {
        const amount = { val: 0 };
        const winScreen = document.createElement('div');

        const style = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: '2',
            top: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            fontSize: `${100 * this.scaleFactor}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: `#${$style.white}`,
            fontFamily: 'Rimbo-Regular'
        };
        Object.assign(winScreen.style, style);

        winScreen.innerHTML = `${amount.val}`;
        const amountAnim = gsap.to(amount, {
            duration: 1.0,
            val: winAmount,
            ease: "power1.inOut",
            onUpdate: () => {
                winScreen.innerHTML = `${amount.val.toFixed(0)}`;
            },
            onComplete: () => {
                amountAnim.kill();

                winScreen.addEventListener('click', winScreen.remove);
                const winClear = setTimeout(() => {
                    if (winClear) {
                        winScreen.removeEventListener('click', winScreen.remove);
                        winScreen.remove();
                    }
                    clearTimeout(winClear);
                }, 1_000)
            }
        });

        document.body.appendChild(winScreen);
    }

    resize(originalRect) {
        const scaleFactorHeight = window.innerHeight / originalRect.h;
        const scaleFactorWidth = window.innerWidth / originalRect.w;

        if (isMobile) {
            this.scaleFactor = Math.min(scaleFactorHeight, scaleFactorWidth);
        }
        if (!isMobile) {
            this.scaleFactor = Math.max(scaleFactorHeight, scaleFactorWidth);
        }

        this.container.scale.set(this.scaleFactor);
        this.subContainer.scale.set(this.scaleFactor);

        this.subContainer.y = (window.innerHeight / 2) - (this.subContainer.height / 2) + this.slot.canopy.yGap + (this.slot.characterMain.yGap / 2);
        this.subContainer.x = (window.innerWidth / 2) - (this.subContainer.width / 2) + this.slot.canopy.xGap + (this.slot.splashLeft.container.width - ((176 - 8) * this.slot.splashLeft.scaleFactor)) + (this.slot.splashRight.container.width + ((8 + 8) * this.slot.splashRight.scaleFactor));



        //this.subContainer.y = (window.innerHeight / 2) - (this.subContainer.height / 2);
        //this.subContainer.x = 0;
    }

    createDrink() {
        this.drink = new Drink(this.scaleFactor, true);
        this.drink.resetLevel();
        setTimeout(() => {
            this.drink.bubbleSpeed = 0.001;
            this.drink.setLevel(10);

            this.bonus = new Bonus(this.scaleFactor);
            this.container.addChild(this.bonus.container);
        }, 2_500);

        this.container.addChild(this.drink.container);
    }

    update(dt) {
        this.slot.update(dt);

        if (this.drink) {
            this.drink.update(dt);
        }
    }
}