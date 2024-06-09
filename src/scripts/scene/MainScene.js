import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";
import { PlayUI } from "../game/PlayUI.js";
import { SettingUI } from "../game/SettingUI.js";
import { $configs, $style } from "../system/SETUP.js";
import { $globals } from "../system/utils.js";
import { gsap } from 'gsap';
import { Bonus } from "../game/Bonus.js";
import { isMobile } from "../system/utils.js";

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
        this.isAutoPlayActive = false;

        this.createBackground();
        this.createSlot();
        this.createPlayUI();
        this.createSettingUI();

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
        if (!this.slot.isReady || this.slot.reels.isPlaying || this.bonus?.isPlaying) return;

        this.playUI.play.element.style.filter = 'grayscale(100%)';
        this.slot.reels.reset();

        if (this.slot.bonusCounter === 10) {
            if (this.bonus && !this.bonus.isPlaying) {
                if (this.bonus.bonusTracker.counter === 0) this.slot.reels.getConditionAndSymbol();

                const config = {
                    condition: $configs.SELECTED_CONDITION,
                    symbol: $configs.SELECTED_SYMBOL
                };

                this.playUI.play.element.style.filter = 'grayscale(100%)';
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
            $globals.assets.audio['SlotFreeSpinSfx'].play();
            this.playUI.play.element.style.filter = 'grayscale(100%)';
            this.createBonusGame();
            this.slot.drink.emitter.emit = true;
            this.slot.characterSwitch('drink');
        }

        const timeout = setTimeout(() => {
            if (this.isAutoPlayActive) {
                this.play();
            }
            clearTimeout(timeout);
        }, 1_000);
    }

    createBonusGame() {
        this.slot.drink.EE.once('animationComplete', () => {
            this.slot.reels.container.alpha = 0;

            this.bonus = new Bonus(this.slot.body.scaleFactor, this.slot.reels.container);
            this.slot.container.addChild(this.bonus.container);
            this.playUI.play.element.style.filter = 'grayscale(0)';

            const timeout = setTimeout(() => {
                if (this.isAutoPlayActive) {
                    this.play();
                }
                clearTimeout(timeout);
            }, 1_000);

            this.bonus.EE.on('animationComplete', () => {
                $globals.assets.audio['SlotTickSfx'].play();

                if (this.bonus.bonusTracker.counter === 1) {
                    const [, , RandomTextureBehavior] = this.slot.drink.emitter.initBehaviors;

                    this.slot.drink.emitter.emit = false;
                    const assetName = this.bonus.bonusTracker.lastSymbol.replace(/\b\w/g, l => l.toUpperCase()) + 'Icon';

                    const texture = $globals.assets.menu[assetName]
                    const rotatedTexture = new PIXI.Texture(texture.baseTexture, texture.frame, texture.orig, texture.trim, 2);

                    RandomTextureBehavior.textures = [$globals.assets.body['BubbleImage'], rotatedTexture];
                    this.slot.drink.emitter.emit = true;

                    this.playUI.play.element.style.filter = 'grayscale(0)';

                    const timeout = setTimeout(() => {
                        if (this.isAutoPlayActive) {
                            this.play();
                        }
                        clearTimeout(timeout);
                    }, 1_000);

                    return;
                }

                if (this.bonus.bonusTracker.counter === 2) {
                    let winAmount = 0;
                    switch (this.bonus.bonusTracker.condition) {
                        case 'lose':
                        case 'fake-win':
                            break;
                        case 'win':
                            winAmount = $configs.USER.MIN_BET * 2;
                            $configs.USER.BALANCE += winAmount;

                            $globals.assets.audio['SlotWinSfx'].play();
                            this.createWinScreen(winAmount);
                            break;
                        case 'mega-win':
                            winAmount = $configs.USER.MIN_BET * 5;
                            $configs.USER.BALANCE += winAmount;

                            $globals.assets.audio['SlotMegaWinSfx'].play();
                            this.createWinScreen(winAmount);
                    }

                    this.slot.balance.text.text = $configs.USER.BALANCE;

                    const bonusTimeout = setTimeout(() => {
                        this.slot.bonusCounter = 1;
                        this.slot.drink.emitter.emit = false;
                        this.slot.drink.setLevel(this.slot.bonusCounter);
                        this.slot.characterSwitch('main');

                        this.bonus.container.destroy();
                        this.bonus = null;
                        this.slot.reels.container.alpha = 1;
                        this.playUI.play.element.style.filter = 'grayscale(0)';

                        this.slot.drink.EE.once('animationComplete', () => {
                            const [, , RandomTextureBehavior] = this.slot.drink.emitter.initBehaviors;

                            this.slot.drink.emitter.emit = false;
                            RandomTextureBehavior.textures = [$globals.assets.body['BubbleImage']];
                            this.slot.drink.emitter.emit = true;
                        });

                        const timeout = setTimeout(() => {
                            if (this.isAutoPlayActive) {
                                this.play();
                            }
                            clearTimeout(timeout);
                        }, 1_000);

                        clearTimeout(bonusTimeout);
                    }, 1_000);
                }
            });
        });
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
            fontSize: `${isMobile ? 75 * this.scaleFactor : 100 * this.scaleFactor}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: `#${$style.white}`,
            fontFamily: 'Rimbo-Regular',
            textShadow: `0 0 10px #${$style.black}`
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

    resize(originalRect) {
        const scaleFactorHeight = window.innerHeight / originalRect.h;
        const scaleFactorWidth = window.innerWidth / originalRect.w;

        if (isMobile) {
            this.scaleFactor = Math.min(scaleFactorHeight, scaleFactorWidth);
        } else {
            this.scaleFactor = Math.max(scaleFactorHeight, scaleFactorWidth);
        }

        this.container.scale.set(this.scaleFactor);

        const xGapSplash = 8;
        this.container.y = (window.innerHeight / 2) - (this.container.height / 2) + this.slot.characterMain.yGap;
        this.container.x = (window.innerWidth / 2) - (this.container.width / 2) + (this.slot.splashLeft.container.width - (xGapSplash * this.slot.splashLeft.scaleFactor));
    }

    remove() {
        this.container.destroy();
        this.background.container.remove();
        this.playUI.container.remove();
        this.settingUI.container.remove();
    }

    update(dt) {
        this.slot.update(dt);
    }
}