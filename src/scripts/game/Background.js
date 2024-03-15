import { isMobile } from "../system/utils.js";

export class Background {
    constructor() {
        this.createBackground();

        document.body.addEventListener('click', () => {
            if (isMobile) document.documentElement.requestFullscreen();
        })
    }

    createBackground() {
        document.body.style.backgroundImage = `url("/src/assets/image/back_COMPRESSED.jpg")`;
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "left bottom";
        document.body.style.backgroundSize = "cover";
    }
}