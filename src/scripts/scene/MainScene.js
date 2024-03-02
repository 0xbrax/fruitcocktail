import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();

        //this.createBackground();
        this.createSlot();
    }

    createBackground() {
        const background = new Background();
        this.container.addChild(background.container);
    }
    createSlot() {
        const slot = new Slot();
        this.container.addChild(slot.container);
    }
}