import { isMobile } from "../system/utils.js";

export class Background {
    constructor() {
        this.createBackground();

        document.body.addEventListener('click', () => {
            if (isMobile) document.documentElement.requestFullscreen();
        })
    }

    createBackground() {
        this.background = document.createElement('div');
        this.background.style.width = '100%';
        this.background.style.height = '100%';
        this.background.style.position = 'absolute';
        this.background.style.zIndex = '0';
        this.background.style.top = '0';
        this.background.style.left = '0';
        this.background.style.backgroundImage = `url("/src/assets/image/back_COMPRESSED.jpg")`;
        this.background.style.backgroundRepeat = "no-repeat";
        this.background.style.backgroundPosition = "left bottom";
        this.background.style.backgroundSize = "cover";

        document.body.appendChild(this.background);
    }
}