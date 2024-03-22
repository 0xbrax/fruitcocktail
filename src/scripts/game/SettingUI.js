import { Button } from "./Button.js";
import { isMobile } from "../system/utils.js";

export class SettingUI {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'setting-ui';
        const style = {
            position: 'absolute',
            zIndex: '2',
        };

        if (isMobile) {
            style.top = '25px';
            style.right = '25px';
        }
        if (!isMobile) {
            style.bottom = '50px';
            style.left = '50px';
        }

        Object.assign(this.container.style, style);

        this.setting = new Button('setting');

        this.container.appendChild(this.setting.element);

        document.body.appendChild(this.container);
    }
}