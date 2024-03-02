import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";

export class MainScene {
    constructor() {
        this.background = null;
        this.container = new PIXI.Container();

        this.createBackground();
        this.createSlot();
    }

    createBackground() {
        this.background = new Background();
        this.container.addChild(this.background.container);
    }
    createSlot() {
        const slot = new Slot(this.background.container);
        this.container.addChild(slot.container);
    }
}