import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";
import { PlayUI } from "../game/PlayUI.js";
import { SettingUI } from "../game/SettingUI.js";
import { $configs, $style } from "../system/SETUP.js";
import { $globals } from "../system/utils.js";
import { gsap } from 'gsap';
import { Drink } from "../game/Drink.js";
import { Bonus } from "../game/Bonus.js";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();

        this.scaleFactor = null;
        this.background = null;
        this.slot = null;
        this.playUI = null;
        this.settingUI = null;
        this.userBet = null;
        this.bonus = null;
        this.drink = null;
        this.isAutoPlayActive = false;

        this.createBackground();
        this.createSlot();
        this.createPlayUI();
        this.createSettingUI();

        $globals.assets.audio['BackgroundMusicTrack'].volume = 0.5;
        $globals.assets.audio['BackgroundMusicTrack'].loop = true;
        $globals.assets.audio['BackgroundMusicTrack'].play();

        this.slot.EE.on('ready', () => {
            this.playUI.play.element.style.filter = 'grayscale(0)';
        });

        this.playUI.play.element.addEventListener('click', () => {
            if (this.isAutoPlayActive) return;

            this.play();
        });

        this.playUI.autoPlay.element.addEventListener('click', () => {
            this.autoPlayHandler();

            if (!this.isAutoPlayActive) return;

            this.play();
        });

        this.playUI.fastForward.element.addEventListener('click', () => {
            this.fastForwardHandler();
        });

        this.slot.reels.EE.on('animationComplete', () => {
            this.checkCondition();
        });
    }

    createBackground() {
        this.background = new Background();
    }
    createSlot() {
        this.slot = new Slot();
        this.container.addChild(this.slot.container);
    }
    createPlayUI() {
        this.playUI = new PlayUI();
    }
    createSettingUI() {
        this.settingUI = new SettingUI();
    }

    play() {
        console.log('LOG Bonus counter', this.slot.bonusCounter)
        if (!this.slot.isReady || this.slot.reels.isPlaying) return;

        this.playUI.play.element.style.filter = 'grayscale(100%)';
        this.slot.reels.reset();

        if (this.slot.bonusCounter === 10) {
            if (this.bonus && !this.bonus.isPlaying) {
                if (this.bonus.bonusTracker.counter === 0) this.slot.reels.getConditionAndSymbol();

                const config = {
                    condition: $configs.SELECTED_CONDITION,
                    symbol: $configs.SELECTED_SYMBOL
                };

                this.bonus.play(config, this.slot.reels.isFastForwardActive);
            }

            return;
        }

        if ($configs.USER.BALANCE - $configs.USER.BET < 0) return;
        if ($configs.USER.BALANCE >= 10_000_000) return;

        this.userBet = $configs.USER.BET;
        $configs.USER.BALANCE -= this.userBet;

        this.slot.balance.text.text = $configs.USER.BALANCE;
        this.slot.reels.getConditionAndSymbol();
        this.slot.reels.play();

        console.log('- - - - - LOG ......', $configs.SELECTED_CONDITION, $configs.SELECTED_SYMBOL)
    }

    autoPlayHandler() {
        if (!this.slot.isReady) return;

        if (!this.isAutoPlayActive) {
            this.isAutoPlayActive = true;
            this.playUI.autoPlay.element.style.filter = 'grayscale(0)';
        } else {
            this.isAutoPlayActive = false;
            this.playUI.autoPlay.element.style.filter = 'grayscale(100%)';
        }
    }

    fastForwardHandler() {
        if (!this.slot.isReady) return;

        if (!this.slot.reels.isFastForwardActive) {
            this.slot.reels.isFastForwardActive = true;
            this.playUI.fastForward.element.style.filter = 'grayscale(0)';
        } else {
            this.slot.reels.isFastForwardActive = false;
            this.playUI.fastForward.element.style.filter = 'grayscale(100%)';
        }
    }

    checkCondition() {
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
        this.playUI.play.element.style.filter = 'grayscale(0)';

        if (this.slot.bonusCounter === 10) {
            this.createDrinkAndBonus();
            this.slot.characterSwitch('drink');
        }

        const timeout = setTimeout(() => {
            if (this.isAutoPlayActive) {
                this.play();
            }
            clearTimeout(timeout);
        }, 1_000);
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

                const winScreenRemove = () => {
                    winScreen.remove()
                };

                winScreen.addEventListener('click', winScreenRemove);

                const winClear = setTimeout(() => {
                    if (winClear) {
                        winScreen.removeEventListener('click', winScreenRemove);
                        winScreen.remove();
                    }
                    clearTimeout(winClear);
                }, 1_000);
            }
        });

        document.body.appendChild(winScreen);
    }

    createDrinkAndBonus() {
        this.drink = new Drink(this.scaleFactor, true);
        this.drink.resetLevel();

        setTimeout(() => {
            this.drink.bubbleSpeed = 0.001;
            this.drink.setLevel(10);

            this.drink.EE.on('animationComplete', () => {
                this.bonus = new Bonus(this.slot.body.scaleFactor);
                this.container.addChild(this.bonus.container);

                const timeout = setTimeout(() => {
                    if (this.isAutoPlayActive) {
                        this.play();
                    }
                    clearTimeout(timeout);
                }, 1_000);

                this.bonus.EE.on('animationComplete', () => {
                    if (this.bonus.bonusTracker.counter === 2) {
                        let winAmount = 0;
                        switch (this.bonus.bonusTracker.condition) {
                            case 'lose':
                            case 'fake-win':
                                break;
                            case 'win':
                                winAmount = $configs.USER.MIN_BET * 2;
                                $configs.USER.BALANCE += winAmount;

                                // $globals.assets.audio['SlotMegaWinSfx'].play();
                                this.createWinScreen(winAmount);
                                break;
                            case 'mega-win':
                                winAmount = $configs.USER.MIN_BET * 5;
                                $configs.USER.BALANCE += winAmount;

                                //$globals.assets.audio['SlotMegaWinSfx'].play();
                                this.createWinScreen(winAmount);
                        }

                        const bonusTimeout = setTimeout(() => {
                            this.slot.bonusCounter = 1;
                            this.slot.drink.setLevel(this.slot.bonusCounter);
                            this.slot.characterSwitch('main');

                            this.drink.container.destroy();
                            this.drink = null;
                            this.bonus.container.destroy();
                            this.bonus = null;

                            const timeout = setTimeout(() => {
                                if (this.isAutoPlayActive) {
                                    this.play();
                                }
                                clearTimeout(timeout);
                            }, 1_000);

                            clearTimeout(bonusTimeout);
                        }, 1_000);

                        return;
                    }
                    if (this.bonus.bonusTracker.counter === 1) {
                        const [, , RandomTextureBehavior] = this.drink.emitter.initBehaviors;

                        this.drink.emitter.emit = false;
                        const assetName = this.bonus.bonusTracker.lastSymbol.replace(/\b\w/g, l => l.toUpperCase()) + 'Icon';
                        RandomTextureBehavior.textures = [...Array(5).fill($globals.assets.main['BubbleImage']), $globals.assets.menu[assetName]];
                        this.drink.emitter.emit = true;
                        this.drink.bubbleSpeed = 0.004;

                        const timeout = setTimeout(() => {
                            if (this.isAutoPlayActive) {
                                this.play();
                            }
                            clearTimeout(timeout);
                        }, 1_000);
                    }
                });
            });
        }, 2_500);

        this.container.addChild(this.drink.container);
    }

    resize(originalRect) {
        const scaleFactorHeight = window.innerHeight / originalRect.h;
        const scaleFactorWidth = window.innerWidth / originalRect.w;

        this.scaleFactor = Math.min(scaleFactorHeight, scaleFactorWidth);

        this.container.scale.set(this.scaleFactor);

        if (this.slot) {
            this.slot.resize();
        }
        if (this.drink) {
            const scaleFactor = Math.max(scaleFactorHeight, scaleFactorWidth);
            this.drink.container.scale.set(scaleFactor);
        }
        if (this.bonus) {
            this.bonus.container.scale.set(this.scaleFactor);
            this.bonus.container.y = (window.innerHeight / 2);
            this.bonus.container.x = (window.innerWidth / 2);
        }
    }

    remove() {
        this.container.destroy();
        this.background.container.remove();
        this.playUI.container.remove();
        this.settingUI.container.remove();
    }

    update(dt) {
        this.slot.update(dt);

        if (this.drink) {
            this.drink.update(dt);
        }
    }
}