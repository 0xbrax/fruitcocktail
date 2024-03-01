import * as PIXI from "pixi.js"
import { $globals } from "./utils.js";
import { Loader } from "./Loader.js";
import { SceneManager } from "../scene/SceneManager.js";
import { LoadingScene } from "../scene/LoadingScene.js";

class Application {
    run() {
        this.app = new PIXI.Application({
            resizeTo: window,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.body.appendChild(this.app.view);

        $globals.scene = new SceneManager();
        this.app.stage.addChild($globals.scene.container);

        $globals.scene.start(new LoadingScene());
        console.log('loading.....')
        this.loader = new Loader(PIXI.Assets);
        this.loader.preload().then(() => this.start());
    }

    start() {
        console.log('LOADED')
        //$globals.scene.start(null);
    }
}

export const App = new Application();