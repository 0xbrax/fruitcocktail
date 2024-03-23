import { DISCLAIMER_TEXT } from "./scripts/system/SETUP.js";
import './style.css';

import WebFont from 'webfontloader';
import { App } from "./scripts/system/App.js";
import IHeroicons from "./scripts/system/IHeroicons.js";

customElements.define('i-heroicons', IHeroicons);

console.log(
    `%c\u26A0 %cDISCLAIMER: %c${DISCLAIMER_TEXT}`,
    'font-size: 25px;',
    'color: red; font-weight: bold;',
    'font-style: italic;'
);

WebFont.load({
    custom: {
        families: ['Rimbo-Regular']
    },
    active: () => {
        App.run();
    }
});