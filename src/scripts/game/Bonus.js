import * as PIXI from "pixi.js";
import {$globals, getCryptoRandomNumber, getPseudoRandomNumber, isMobile} from "../system/utils.js";
import { $configs } from "../system/SETUP.js";
import { gsap } from "gsap";

export class Bonus {
    constructor(scaleFactor) {
        this.EE = new PIXI.utils.EventEmitter();
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.scaleFactor = scaleFactor;

        this.degIncrease = 45;
        this.degMap = {}
        this.skeletonHeight = null;
        this.sprites = [];
        this.createSprites();

        this.bonusTracker = {
            counter: 0,
            condition: null,
            winSymbol: null,
            lastSymbol: null,
        }

        this.isPlaying = false;
    }

    createSprite(symbol, deg) {
        const symbolName = symbol.replace(/\b\w/g, l => l.toUpperCase());
        const sprite = new PIXI.Sprite($globals.assets.menu[`${symbolName}Icon`]);

        sprite.symbolName = symbol;

        sprite.height = ($configs.SYMBOL_SIZE / 1.25) * this.scaleFactor;
        sprite.width = ($configs.SYMBOL_SIZE / 1.25) * this.scaleFactor;

        const maskContainer = new PIXI.Container();
        const mask = new PIXI.Graphics();
        this.skeletonHeight = (isMobile ? window.innerWidth : window.innerHeight) - (sprite.height * 2);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 0, this.skeletonHeight);
        mask.endFill();

        sprite.anchor.set(0.5);
        sprite.x = mask.x;
        sprite.y = mask.y;
        sprite.rotation = -deg;

        maskContainer.pivot.x = 0;
        maskContainer.pivot.y = this.skeletonHeight / 2;
        maskContainer.rotation = deg;

        maskContainer.x = window.innerWidth / 2;
        maskContainer.y = window.innerHeight / 2;

        this.sprites.push(sprite);
        maskContainer.addChild(mask);
        maskContainer.addChild(sprite);
        this.container.addChild(maskContainer);
    }

    createSprites() {
        let deg = 0;
        $configs.ALL_SYMBOLS.forEach((symbol, index) => {
            const rotation = deg * (Math.PI / 180);
            this.createSprite(symbol, rotation);
            this.degMap[index] = deg;
            deg += this.degIncrease;
        });

        this.container.pivot.x = window.innerWidth / 2;
        this.container.pivot.y = window.innerHeight / 2;

        this.container.x = window.innerWidth / 2;
        this.container.y = window.innerHeight / 2;
    }

    play(config, isFastForwardActive) {
        this.isPlaying = true;
        const { condition, symbol } = config;

        let selectedSymbolIndex;
        let selectedSymbol;

        if (this.bonusTracker.counter === 0) {
            this.bonusTracker.condition = condition;
            this.bonusTracker.winSymbol = symbol;
        }

        if (this.bonusTracker.condition === 'win' || this.bonusTracker.condition === 'mega-win') {
            this.bonusTracker.lastSymbol = symbol;
            selectedSymbolIndex = this.sprites.map(el => el.symbolName).indexOf(symbol);
        } else {
            selectedSymbolIndex = getCryptoRandomNumber(0, $configs.REEL_LENGTH - 1);
            selectedSymbol = this.sprites[selectedSymbolIndex].symbolName;

            while (selectedSymbol === this.bonusTracker.lastSymbol || selectedSymbol === $configs.JOLLY) {
                selectedSymbolIndex = getCryptoRandomNumber(0, $configs.REEL_LENGTH - 1);
                selectedSymbol = this.sprites[selectedSymbolIndex].symbolName;
            }

            this.bonusTracker.lastSymbol = selectedSymbol;
        }

        console.log('LOG BONUS', condition, symbol, this.bonusTracker)

        const containerDeg = (this.container.rotation * 180) / Math.PI;

        const animDuration = getPseudoRandomNumber(32, 48) / 10;
        const newAnimDuration = !isFastForwardActive ? animDuration : (animDuration / 2); // play speed x2

        let animRevolution = getPseudoRandomNumber(57, 63);
        animRevolution = Math.floor((animRevolution / animDuration) * newAnimDuration); // revolutions sync with animation duration

        const degToGo = this.degIncrease * animRevolution;

        const anim0 = gsap.to(this.container, {
            pixi: {
                rotation: containerDeg + degToGo
            },
            duration: newAnimDuration,
            repeat: 0,
            ease: "power1.inOut",
            onComplete: () => {
                anim0.kill();
            }
        });

        this.sprites.forEach((sprite, index) => {
            const anim1 = gsap.to(sprite.parent, {
                pixi: {
                    zIndex: selectedSymbolIndex === index ? 2 : 1
                },
                duration: newAnimDuration,
                repeat: 0,
                ease: "power1.inOut",
                onComplete: () => {
                    anim1.kill();
                }
            });

            const anim2 = gsap.to(sprite, {
                pixi: {
                    rotation: -this.degMap[index] - degToGo,
                },
                keyframes: [
                    { y: 0 },
                    { y: (this.skeletonHeight / 2) },
                ],
                duration: newAnimDuration,
                repeat: 0,
                ease: "power1.inOut",
                onComplete: () => {
                    anim2.kill();

                    this.sprites.forEach((sprite, index) => {
                        const deg = (sprite.rotation * 180) / Math.PI;
                        this.degMap[index] = -deg;
                    });

                    if (index === $configs.REEL_LENGTH - 1) {
                        this.bonusTracker.counter++;
                        this.isPlaying = false;
                        this.EE.emit('animationComplete');
                    }
                }
            });
        })
    }
}