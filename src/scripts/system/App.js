import * as PIXI from "pixi.js"
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { $globals } from "./utils.js";
import { $style } from "./SETUP.js";
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
            backgroundColor: `#${$style.black}`,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            //antialias: true
        });
        document.body.appendChild(this.app.view);
        window.addEventListener('resize', this.resize.bind(this, this.originalRect));

        $globals.scene = new SceneManager();
        this.app.stage.addChild($globals.scene.container);
        // delta time
        this.app.ticker.add(dt => $globals.scene.update(dt));

        console.log('loading .............................')
        $globals.scene.start(new LoadingScene());
        this.resize(this.originalRect);
        this.loader = new Loader();


        this.loader.preloadAssets().then(() => {
            $globals.scene.createDrink();
            $globals.scene.createText();

            const convertedProgress = (value) => {
                const a = 0;
                const b = 100;
                const c = 3; // min value
                const d = 10; // max value

                return ((value - a) / (b - a)) * (d - c) + c;
            }

            this.loader.on('progress', (progress) => {
                console.log(`Progress: ${progress}%`);

                $globals.scene.setLoadingProgress(convertedProgress(progress));
            });

            this.loader.loadAssets().then(() => {
                setTimeout(() => {
                    this.start();
                }, 1_000)
            });
        });
    }

    start() {
        console.log('LOADED !!!!!!!!!!!!!!!!!!!!!!!!!!')
        $globals.scene.start(new MainScene());
        this.resize(this.originalRect);
    }

    resize(originalRect) {
        $globals.scene.resize(originalRect);
        this.app.resize(window.innerWidth, window.innerHeight);
    }
}

export const App = new Application();