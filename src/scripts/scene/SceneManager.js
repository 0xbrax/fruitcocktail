import * as PIXI from "pixi.js";

export class SceneManager {
    constructor() {
        this.container = new PIXI.Container();
        this.scene = null;
    }

    start(scene) {
        if (this.scene) {
            this.scene.container.destroy();
            //this.scene.remove();
            this.scene = null;
        }

        this.scene = scene
        this.container.addChild(this.scene.container);
    }

    resize(originalRect) {
        if (this.scene && this.scene.container) {
            this.scene.resize(originalRect);
        }
    }

    update(dt) {
        if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }
    }
}