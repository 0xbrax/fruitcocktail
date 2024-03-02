import * as PIXI from "pixi.js";
import { $globals } from "../system/utils.js";
import { Body } from "./Body.js";

export class Slot {
    constructor() {
        this.container = new PIXI.Container();

        const body = new Body(this.container);
        this.container.addChild(body.container);
    }
}