import { DISCLAIMER_TEXT } from "./scripts/system/SETUP.js";
import './style.css';

import WebFont from 'webfontloader';
import { App } from "./scripts/system/App.js";
import IHeroicons from "./scripts/system/IHeroicons.js";
import { $globals, exitFullscreen } from "./scripts/system/utils.js";
import { Howler } from "howler";

customElements.define('i-heroicons', IHeroicons);

console.log(
    `%c\u26A0 %cDISCLAIMER: %c${DISCLAIMER_TEXT + '\n'}`,
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