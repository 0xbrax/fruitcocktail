import { CharacterSprite } from "./CharacterSprite.js";

export class CharacterDrink extends CharacterSprite {
    constructor(scaleFactor) {
        super(scaleFactor, 'CharacterDrinkSprite', 1207, 596)

        this.createSprite();
    }
}