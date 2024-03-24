import * as PIXI from "pixi.js";
import { Background } from "../game/Background.js";
import { Slot } from "../game/Slot.js";
import { PlayUI } from "../game/PlayUI.js";
import { SettingUI } from "../game/SettingUI.js";
import { isMobile } from "../system/utils.js";
import { $configs } from "../system/SETUP.js";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();
        this.background = null;
        this.slot = null;
        this.playUI = null;
        this.settingUI = null;

        //this.createBackground();
        this.createSlot();
        this.createPlayUI();
        this.createSettingUI();

        this.slot.on('preReady', () => {
            this.playUI.play.element.style.filter = 'grayscale(0)';
        });

        this.playUI.play.element.addEventListener('click', () => {
            if (!this.slot.isReady || this.slot.reels.isPlaying) return;

            this.slot.reels.getConditionAndSymbol();
            this.slot.reels.play();

            console.log('LOG...', $configs.SELECTED_CONDITION, $configs.SELECTED_SYMBOL)
        });
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
        this.container.x = (window.innerWidth / 2) - (this.container.width / 2) + this.slot.canopy.xGap + (this.slot.splashLeft.container.width - ((176 - 8) * this.slot.splashLeft.scaleFactor)) + (this.slot.splashRight.container.width + ((8 + 8) * this.slot.splashRight.scaleFactor));
    }

    update(dt) {
        this.slot.update(dt);
    }
}