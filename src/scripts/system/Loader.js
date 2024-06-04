import * as PIXI from "pixi.js";
import { Howl } from 'howler';
import { $globals } from "./utils.js";
import { assets } from "./Assets.js";

export class Loader {
    constructor() {
        this.EE = new PIXI.utils.EventEmitter();
        this.assets = assets;

        for (const key in this.assets) {
            $globals.assets[key] = {};
        }
    }

    preloadAssets() {
        return new Promise(async resolve => {
            PIXI.Assets.add({ alias: 'BubbleImage', src: this.assets.main['BubbleImage'] });
            $globals.assets.main['BubbleImage'] = await PIXI.Assets.load('BubbleImage');

            PIXI.Assets.add({ alias: 'LogoFullImage', src: this.assets.other['LogoFullImage'] });
            $globals.assets.other['LogoFullImage'] = await PIXI.Assets.load('LogoFullImage');

            resolve();
        });
    }

    loadAssets() {
        return new Promise(async resolve => {
            const totalAssetsCount = Object.keys(this.assets).reduce((acc, key) => {
                return acc + Object.keys(this.assets[key]).length;
            }, 0);

            let loadedAssetsCount = 0;
            const updateProgress = () => {
                const progress = parseInt((loadedAssetsCount / totalAssetsCount) * 100);
                this.EE.emit('progress', progress);
            };
            updateProgress();

            for (const key in this.assets) {
                if (key === 'audio') {
                    for (const subKey in this.assets[key]) {
                        $globals.assets[key][subKey] = await this.loadSound(this.assets[key][subKey]);

                        loadedAssetsCount++;
                        updateProgress();
                    }
                    continue;
                }

                if (key === 'main') {
                    $globals.assets[key]['BackgroundVideo'] = this.assets[key]['BackgroundVideo'];
                    loadedAssetsCount++;
                    updateProgress();
                    continue;
                }

                if (key === 'symbols' || key === 'character') {
                    for (const subKey in this.assets[key]) {
                        PIXI.Assets.add({ alias: subKey, src: this.assets[key][subKey] });
                        $globals.assets[key][subKey] = await PIXI.Assets.load(subKey);

                        loadedAssetsCount++;
                        updateProgress();
                    }
                    continue;
                }

                for (const subKey in this.assets[key]) {
                    if (subKey === 'BubbleImage') continue;
                    if (subKey === 'LogoFullImage') continue;
                    if (subKey === 'PaytableImage') {
                        $globals.assets[key][subKey] = this.assets[key][subKey];
                        loadedAssetsCount++;
                        updateProgress();
                        continue;
                    }

                    PIXI.Assets.add({ alias: subKey, src: this.assets[key][subKey] });
                    $globals.assets[key][subKey] = await PIXI.Assets.load(subKey);

                    loadedAssetsCount++;
                    updateProgress();
                }
            }

            loadedAssetsCount = totalAssetsCount;
            updateProgress();
            //this.mixerAudio();

            resolve();
        });
    }

    loadSound(src) {
        return new Promise((resolve) => {
            const sound = new Howl({
                src: [src],
                onload: () => {
                    resolve(sound);
                },
            });
        });
    }

    mixerAudio() {
        $globals.assets.audio['SlotMegaWinSfx'].volume(0.6);
        $globals.assets.audio['SlotMegaWinSfx'].loop(true);
    }
}