import * as PIXI from "pixi.js";
import { $globals } from "./utils.js";
import { assets } from "./Assets.js";

export class Loader extends PIXI.utils.EventEmitter {
    constructor() {
        super();

        this.assets = assets;

        for (const key in this.assets) {
            $globals.assets[key] = {};
        }
    }

    preloadAssets() {
        return new Promise(async resolve => {
            PIXI.Assets.add({ alias: 'BubbleImage', src: this.assets['ui']['BubbleImage'] });
            $globals.assets.ui['BubbleImage'] = await PIXI.Assets.load('BubbleImage');

            resolve();
        });
    }

    loadAssetsOLD() {
        return new Promise(async resolve => {
            for (const key in this.assets) {
                if (key === 'audio') continue; // TODO Use --> howler js

                if (key === 'symbols' || key === 'character') {
                    for (const subKey in this.assets[key]) {
                        const spritesheet = new PIXI.Spritesheet(
                            PIXI.BaseTexture.from('/src/assets/sprite/' + this.assets[key][subKey].meta.image),
                            this.assets[key][subKey]
                        );
                        await spritesheet.parse();
                        $globals.assets[key][subKey] = spritesheet;
                    }
                    continue;
                }

                for (const subKey in this.assets[key]) {
                    if (subKey === 'BubbleImage') continue;

                    PIXI.Assets.add({ alias: subKey, src: this.assets[key][subKey] });
                    $globals.assets[key][subKey] = await PIXI.Assets.load(subKey);
                }
            }

            resolve();
        });
    }

    loadAssets() {
        return new Promise(async resolve => {
            const totalAssetsCount = Object.keys(this.assets).reduce((acc, key) => {
                if (key === 'audio') return acc; // esclude 'audio' dal conteggio totale per ora
                return acc + Object.keys(this.assets[key]).length;
            }, 0);

            let loadedAssetsCount = 0;
            const updateProgress = () => {
                const progress = parseInt((loadedAssetsCount / totalAssetsCount) * 100);
                this.emit('progress', progress);
            };
            updateProgress();



            for (const key in this.assets) {
                if (key === 'audio') continue; // TODO: Usare howler.js

                if (key === 'symbols' || key === 'character') {
                    for (const subKey in this.assets[key]) {
                        const spritesheet = new PIXI.Spritesheet(
                            PIXI.BaseTexture.from('/src/assets/sprite/' + this.assets[key][subKey].meta.image),
                            this.assets[key][subKey]
                        );
                        await spritesheet.parse();
                        $globals.assets[key][subKey] = spritesheet;

                        loadedAssetsCount++;
                        updateProgress();
                    }
                    continue;
                }

                for (const subKey in this.assets[key]) {
                    if (subKey === 'BubbleImage') continue;

                    PIXI.Assets.add({ alias: subKey, src: this.assets[key][subKey] });
                    $globals.assets[key][subKey] = await PIXI.Assets.load(subKey);

                    loadedAssetsCount++;
                    updateProgress();
                }
            }

            loadedAssetsCount = totalAssetsCount;
            updateProgress();

            resolve();
        });
    }
}