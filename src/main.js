import './style.css';
import WebFont from 'webfontloader';

import { App } from "./scripts/system/App.js";

WebFont.load({
    custom: {
        families: ['Rimbo-Regular']
    },
    active: () => {
        App.run();
    }
});