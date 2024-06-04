import { CharacterSprite } from "./CharacterSprite.js";

export class CharacterMain extends CharacterSprite {
    constructor(scaleFactor) {
        super(scaleFactor, 'CharacterMainSprite', 1175, 550);

        this.createSprite();
    }
}