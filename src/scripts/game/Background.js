import { $globals, isMobile } from "../system/utils.js";
import { $style } from "../system/SETUP.js";

export class Background {
    constructor() {
        this.createBackground();
    }

    createBackground() {
        this.background = document.createElement('div');
        this.background.style.width = '100%';
        this.background.style.height = '100%';
        this.background.style.position = 'absolute';
        this.background.style.zIndex = '0';
        this.background.style.top = '0';
        this.background.style.left = '0';
        this.background.style.overflow = 'hidden';

        this.background.innerHTML = `
            <video muted loop playisinline autoplay style="${isMobile ? 'height: 100%;' : 'height: 100%; width: 100%; object-fit: cover;'}">
                <source src="${$globals.assets.other['BackgroundVideo']}" type="video/mp4">
            </video>
        `;

        this.background.style.filter = "blur(2px)";
        this.background.style.boxShadow = `inset 0 0 20px 0 ${$style.black}`;

        document.body.appendChild(this.background);
    }
}