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
        this.originalWidth = window.innerWidth;
        this.originalHeight = window.innerHeight;

        window.addEventListener('resize', () => this.resizeApp());
    }
    run() {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.app = new PIXI.Application({
            width: this.originalWidth,
            height: this.originalHeight,
            resizeTo: window,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.body.appendChild(this.app.view);

        $globals.scene = new SceneManager();
        this.app.stage.addChild($globals.scene.container);
        // delta time
        this.app.ticker.add(dt => $globals.scene.update(dt));

        $globals.scene.start(new LoadingScene());
        this.resizeApp();
        console.log('loading .............................')
        this.loader = new Loader();
        this.loader.preload().then(() => this.start());
    }

    start() {
        console.log('LOADED !!!!!!!!!!!!!!!!!!!!!!!!!!')
        $globals.scene.start(new MainScene());
        this.resizeApp();
    }
    resizeApp() {
        if (!$globals.scene) return;

        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        const scaleFactorWidth = window.innerWidth / this.originalWidth;
        const scaleFactorHeight = window.innerHeight / this.originalHeight;
        const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

        $globals.scene.container.scale.set(scaleFactor);
        $globals.scene.container.x = (window.innerWidth / 2) - ($globals.scene.container.width / 2);
        $globals.scene.container.y = (window.innerHeight / 2) - ($globals.scene.container.height / 2);
    }
}

export const App = new Application();