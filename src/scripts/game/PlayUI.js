import { Button } from "./Button.js";
import { isMobile } from "../system/utils.js";
import { $style } from "../system/SETUP.js";

export class PlayUI {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'play-ui';
        const style = {
            position: 'absolute',
            zIndex: '2',

            display: 'flex',
            alignItems: 'flex-end',
            gap: '25px'
        };

        if (isMobile) {
            style.bottom = '25px';
            style.left = '50%';
            style.transform = 'translateX(-50%)';

            style.justifyContent = 'center';
        }
        if (!isMobile) {
            style.top = '50%';
            style.right = '50px';
            style.transform = 'translateY(-50%)';

            style.flexDirection = 'column';
        }

        Object.assign(this.container.style, style);

        this.fastForward = new Button ('fast-forward');

        const playStyle = `height: ${isMobile ? 100 : 150}px;`;
        this.play = new Button('play', playStyle);
        this.autoPlay = new Button('auto-play');

        this.container.appendChild(this.autoPlay.element);
        this.container.appendChild(this.play.element);
        this.container.appendChild(this.fastForward.element);

        document.body.appendChild(this.container);
    }
}