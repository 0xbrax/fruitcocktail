import { $globals } from "./utils.js";
import { assets } from "./Assets.js";

export class Loader {
    constructor(loader) {
        this.loader = loader;
        this.assets = assets;
    }

    preload() {
        return new Promise(async resolve => {
            for (const key in this.assets) {
                $globals.assets[key] = {};

                if (key === 'audio') continue; // TODO howler js

                for (const subKey in this.assets[key]) {
                    this.loader.add({ alias: subKey, src: typeof this.assets[key][subKey] === 'string' ? this.assets[key][subKey] : '/src/assets/sprite/' + this.assets[key][subKey].meta.image });
                    $globals.assets[key][subKey] = await this.loader.load(subKey);
                }
            }
            resolve();
        });
    }
}