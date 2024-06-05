// TODO Upgrade --> spritesheet to spine

import * as PIXI from "pixi.js"
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { $globals } from "./utils.js";
import { Loader } from "./Loader.js";
import { SceneManager } from "../scene/SceneManager.js";
import { LoadingScene } from "../scene/LoadingScene.js";
import { MainScene } from "../scene/MainScene.js";

class Application {
    constructor() {
        this.app = null;
    }
    run() {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.originalRect = {
            h: window.innerHeight,
            w: window.innerWidth
        }

        this.app = new PIXI.Application({
            height: this.originalRect.h,
            width: this.originalRect.w,
            resizeTo: window,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true
        });
        document.body.appendChild(this.app.view);
        window.addEventListener('resize', this.resize.bind(this, this.originalRect));

        $globals.sceneManager = new SceneManager();
        this.app.stage.addChild($globals.sceneManager.container);
        this.app.ticker.add(dt => $globals.sceneManager.update(dt)); // delta time
        
        this.loader = new Loader();

        this.loader.preloadAssets().then(() => {
            this.loadingScene = new LoadingScene();

            this.loader.EE.on('progress', (progress) => {
                console.log(`Progress: ${progress}%`);

                this.loadingScene.setText(progress);
            });

            this.loader.loadAssets().then(() => {
                this.start();
                
                this.loadingScene.createDisclaimer();
                this.loadingScene.setText('enter');
                this.loadingScene.content.style.cursor = 'pointer';
                this.loadingScene.content.addEventListener('click', () => {
                    this.loadingScene.remove();
                    $globals.assets.audio['BackgroundMusicTrack'].play();
                    $globals.sceneManager.scene.slot.reelsFadeIn();
                }, { once: true });
            });
        });
    }

    start() {
        $globals.sceneManager.start(new MainScene());
        this.resize(this.originalRect);
    }

    resize(originalRect) {
        $globals.sceneManager.resize(originalRect);
        this.app.resize(window.innerWidth, window.innerHeight);
    }
}

export const App = new Application();