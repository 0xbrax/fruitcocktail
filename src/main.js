import './style.css';

import WebFont from 'webfontloader';
import { App } from "./scripts/system/App.js";
import IHeroicons from "./scripts/system/IHeroicons.js";

customElements.define('i-heroicons', IHeroicons);

// DISCLAIMER
const DISCLAIMER_TEXT = `
    This slot machine project is a purely demonstrative and educational exercise developed for showcasing JavaScript programming skills. 
    The virtual currency used within the slot machine has no real-world value and is intended for entertainment purposes only. 
    This project does not involve real money transactions, and its primary purpose is to highlight coding and design capabilities. 
    Any resemblance to actual gambling activities is coincidental. 
    By interacting with this project, users acknowledge that the in-game currency is entirely fictional, and no actual financial transactions are taking place. 
    The developer assumes no responsibility for the misuse or misinterpretation of this project. 
    Viewer discretion is advised.
`;
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