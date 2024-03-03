import * as PIXI from "pixi.js";
import { $globals } from "./utils.js";
import { assets } from "./Assets.js";

export class Loader {
    constructor() {
        this.assets = assets;
    }

    preload() {
        return new Promise(async resolve => {
            for (const key in this.assets) {
                $globals.assets[key] = {};

                if (key === 'audio') continue; // TODO howler js

                if (key === 'symbols' || key === 'character') {
                    for (const subKey in this.assets[key]) {
                        const spritesheet = new PIXI.Spritesheet(
                            PIXI.BaseTexture.from('/src/assets/sprite/' + this.assets[key][subKey].meta.image),
                            this.assets[key][subKey]
                        );

                        await spritesheet.parse();

                        const textures = Object.values(spritesheet.textures);
                        /*textures.forEach(texture => {
                            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            //texture.baseTexture.resolution = 2;
                            //texture.baseTexture.anisotropicLevel = 32; //get max...

                            console.log(texture)
                        });*/

                        $globals.assets[key][subKey] = new PIXI.AnimatedSprite(textures);
                        $globals.assets[key][subKey].currentFrame = 29; // character has more frames

                        //$globals.assets[key][subKey].
                    }
                    continue;
                }

                for (const subKey in this.assets[key]) {
                    PIXI.Assets.add({ alias: subKey, src: typeof this.assets[key][subKey] === 'string' ? this.assets[key][subKey] : '/src/assets/sprite/' + this.assets[key][subKey].meta.image });
                    $globals.assets[key][subKey] = await PIXI.Assets.load(subKey);
                }
            }

            resolve();
        });
    }
}