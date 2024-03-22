import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";
import { PlayUI } from "../game/PlayUI.js";
import { SettingUI } from "../game/SettingUI.js";
import { isMobile } from "../system/utils.js";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();
        this.background = null;
        this.slot = null;

        //this.createBackground();
        this.createSlot();
        this.createPlayUI();
        this.createSettingUI();
    }

    createBackground() {
        this.background = new Background();
    }
    createSlot() {
        this.slot = new Slot();
        this.container.addChild(this.slot.container);
    }
    createPlayUI() {
        this.playUI = new PlayUI();
    }
    createSettingUI() {
        this.settingUI = new SettingUI();
    }

    resize(originalRect) {
        const scaleFactorHeight = window.innerHeight / originalRect.h;
        const scaleFactorWidth = window.innerWidth / originalRect.w;
        let scaleFactor;

        if (isMobile) {
            scaleFactor = Math.min(scaleFactorHeight, scaleFactorWidth);
        }
        if (!isMobile) {
            scaleFactor = Math.max(scaleFactorHeight, scaleFactorWidth);
        }

        this.container.scale.set(scaleFactor);
        this.container.y = (window.innerHeight / 2) - (this.container.height / 2) + this.slot.canopy.yGap + (this.slot.characterMain.yGap / 2);
        this.container.x = (window.innerWidth / 2) - (this.container.width / 2) + this.slot.canopy.xGap;
    }

    update(dt) {
        this.slot.update(dt);
    }
}