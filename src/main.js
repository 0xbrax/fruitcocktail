import { DISCLAIMER_TEXT } from "./scripts/system/SETUP.js";
import './style.css';

import WebFont from 'webfontloader';
import { App } from "./scripts/system/App.js";
import { $configs } from "./scripts/system/SETUP.js";
import { getPseudoRandomNumber } from "./scripts/system/utils.js";
import IHeroicons from "./scripts/system/IHeroicons.js";
import { $globals, exitFullscreen } from "./scripts/system/utils.js";
import { Howler } from "howler";

console.log(
    `%c\u26A0 %cDISCLAIMER: %c${DISCLAIMER_TEXT + '\n'}`,
    'font-size: 25px;',
    'color: red; font-weight: bold;',
    'font-style: italic;'
);



const randomIndexMapStart = getPseudoRandomNumber(0, $configs.REEL_LENGTH);
$configs.MAP.REEL_1 = [...$configs.MAP.REEL_1.slice(randomIndexMapStart), ...$configs.MAP.REEL_1.slice(0, randomIndexMapStart)];
$configs.MAP.REEL_2 = [...$configs.MAP.REEL_2.slice(randomIndexMapStart), ...$configs.MAP.REEL_2.slice(0, randomIndexMapStart)];
$configs.MAP.REEL_3 = [...$configs.MAP.REEL_3.slice(randomIndexMapStart), ...$configs.MAP.REEL_3.slice(0, randomIndexMapStart)];
$configs.MAP.REEL_4 = [...$configs.MAP.REEL_4.slice(randomIndexMapStart), ...$configs.MAP.REEL_4.slice(0, randomIndexMapStart)];
$configs.MAP.REEL_5 = [...$configs.MAP.REEL_5.slice(randomIndexMapStart), ...$configs.MAP.REEL_5.slice(0, randomIndexMapStart)];



customElements.define('i-heroicons', IHeroicons);

WebFont.load({
    custom: {
        families: ['Rimbo-Regular']
    },
    active: () => {
        App.run();
    }
});

let wakelock;
window.addEventListener('load', async () => {
    try {
        wakelock = await navigator.wakeLock.request('screen');

        $globals.isWakelockActive = true;
    } catch (error) {
        //
    }
});
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
        if ($globals.isAudioActive === true) Howler.mute(false);

        if (wakelock) {
            wakelock = await navigator.wakeLock.request('screen');
            $globals.isWakelockActive = true;
        }
    } else {
        if ($globals.isAudioActive === true) Howler.mute(true);

        if ($globals.isFullscreenActive) exitFullscreen();

        if (wakelock) {
            wakelock.release();
            $globals.isWakelockActive = false;
        }
    }
});