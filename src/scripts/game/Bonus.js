import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { $configs } from "../system/SETUP.js";
import { gsap } from "gsap";

export class Bonus {
    constructor(scaleFactor) {
        this.container = new PIXI.Container();
        this.scaleFactor = scaleFactor;

        this.degMap = {}
        this.sprites = [];
        this.createSprites();

        setTimeout(() => {
            this.play();
        }, 5000)
    }

    createSprite(symbol, degGap) {
        const symbolName = symbol.replace(/\b\w/g, l => l.toUpperCase());
        const sprite = new PIXI.Sprite($globals.assets.menu[`${symbolName}Icon`]);
        sprite.height = $configs.SYMBOL_SIZE / 3 * this.scaleFactor;
        sprite.width = $configs.SYMBOL_SIZE / 3 * this.scaleFactor;

        const maskContainer = new PIXI.Container();
        const mask = new PIXI.Graphics();
        const height = window.innerHeight - sprite.height - (100 * this.scaleFactor);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 10, height);
        mask.endFill();

        sprite.anchor.set(0.5);
        sprite.x = mask.x;
        sprite.y = mask.y;
        sprite.rotation = -degGap;

        maskContainer.pivot.x = 0;
        maskContainer.pivot.y = height / 2;
        maskContainer.rotation = degGap;

        maskContainer.x = window.innerWidth / 2;
        maskContainer.y = window.innerHeight / 2;

        this.sprites.push(sprite);
        maskContainer.addChild(mask);
        maskContainer.addChild(sprite);
        this.container.addChild(maskContainer);
    }

    createSprites() {
        let degGap = 0;
        let degIncrease = 45;
        $configs.ALL_SYMBOLS.forEach((symbol, index) => {
            const rotation = degGap * (Math.PI / 180);
            this.createSprite(symbol, rotation);
            this.degMap[index] = degGap;
            degGap += degIncrease;
        });

        this.container.pivot.x = window.innerWidth / 2;
        this.container.pivot.y = window.innerHeight / 2;

        this.container.x = window.innerWidth / 2;
        this.container.y = window.innerHeight / 2;
    }

    play() {
        console.log(this.degMap)
        // TODO sortable children x zindex

        const anim1 = gsap.to(this.container, {
            pixi: {
                rotation: 180
            },
            duration: 2.5,
            repeat: 0,
            ease: "power1.inOut",
            onComplete: () => {
                anim1.kill();
            }
        });
        this.sprites.forEach((sprite, index) => {
            /*const anim1 = gsap.to(this.container.children[index], {
                pixi: {
                    rotation: this.degMap[index] + 180
                },
                duration: 2.5,
                repeat: 0,
                ease: "power1.inOut",
                onComplete: () => {
                    anim1.kill();
                }
            });*/
            const anim2 = gsap.to(sprite, {
                pixi: {
                    rotation: -this.degMap[index] - 180
                },
                duration: 2.5,
                repeat: 0,
                ease: "power1.inOut",
                onComplete: () => {
                    anim2.kill();
                }
            });
        })
    }
}