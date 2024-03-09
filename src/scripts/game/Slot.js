import * as PIXI from "pixi.js";
import { Body } from "./Body.js";
import { Drink } from "./Drink.js";
import { Reels } from "./Reels.js";
import { Canopy } from "./Canopy.js";

export class Slot {
    constructor(backgroundContainer) {
        this.backgroundContainer = backgroundContainer;
        this.container = new PIXI.Container();

        const body = new Body();
        this.container.addChild(body.container);

        this.drink = new Drink(body.scaleFactor);
        this.container.addChild(this.drink.container);

        this.reels = new Reels(body.scaleFactor);
        this.container.addChild(this.reels.container);

        const canopy = new Canopy(body.scaleFactor, body.container);
        //this.container.addChild(canopy.container);
        // TODO Check position...

        this.container.x = (this.backgroundContainer.width / 2) - (this.container.width / 2) + canopy.xGap;
        this.container.y = (this.backgroundContainer.height / 2) - (this.container.height / 2) + canopy.yGap;
    }

    update(dt) {
        this.drink.update(dt);
    }
}