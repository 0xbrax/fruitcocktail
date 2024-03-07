import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";

export class MainScene {
    constructor() {
        this.background = null;
        this.container = new PIXI.Container();
        this.slot = null;

        this.createBackground();
        this.createSlot();
    }

    createBackground() {
        this.background = new Background();
        this.container.addChild(this.background.container);
    }
    createSlot() {
        this.slot = new Slot(this.background.container);
        this.container.addChild(this.slot.container);
    }

    update(dt) {
        this.slot.update(dt);
    }
}