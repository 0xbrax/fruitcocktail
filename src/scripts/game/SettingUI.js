import { Button } from "./Button.js";
import { isMobile, $globals, enterFullscreen, exitFullscreen } from "../system/utils.js";
import { $style } from "../system/SETUP.js";
import { $configs } from "../system/SETUP.js";
import { Howler } from 'howler';

export class SettingUI {
    constructor() {
        this.isOpen = false;
        this.container = document.createElement('div');
        this.container.id = 'setting-ui';

        this.createButton();
        this.createMenu();
    }

    createButton() {
        const style = {
            position: 'absolute',
            zIndex: '4',
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

    createMenu() {
        this.menu = document.createElement('div');
        this.menu.id = 'menu';
        const style = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: '5',
            top: '0',
            left: '0',
            padding: isMobile ? '25px' : '50px 200px',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: `#${$style.white}`,
            fontFamily: 'Rimbo-Regular'
        };

        this.menu.innerHTML = `
            <i-heroicons id="close-btn" icon-name="x-mark" style-name="position: fixed; ${isMobile ? 'top: 25px; right: 25px;' : 'bottom: 50px; left: 50px;'}"></i-heroicons>
        
            <div style="${isMobile ? 'font-size: 35px;' : 'font-size: 50px;' } margin-bottom: 50px;">settings</div>
            
            <div style="height: calc(100% - 50px - 50px); overflow: auto; scroll-behavior: smooth">
                <div style="${isMobile ? 'font-size: 25px;' : 'font-size: 40px;'} margin-bottom: 25px;">bet</div>
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 25px;">
                    <i-heroicons id="bet-decrease-btn" icon-name="minus"></i-heroicons>
                    <span id="bet-value" style="${isMobile ? 'font-size: 25px; line-height: 25px;' : 'font-size: 40px; line-height: 40px;'} margin: 0 20px;">${$configs.USER.BET}</span>
                    <i-heroicons id="bet-increase-btn" icon-name="plus"></i-heroicons>
                </div>
                <div style="${isMobile ? 'font-size: 20px;' : 'font-size: 30px;'} margin-bottom: 50px;">
                    <div>free spin = min bet</div>
                    <div>min bet = 100</div>
                    <div>max bet = 1000</div>
                </div>
                
                <div style="${isMobile ? 'font-size: 30px;' : 'font-size: 40px;'} margin-bottom: 25px;">configs</div>
                <div style="margin-bottom: 50px;">
                    <i-heroicons id="home-btn" icon-name="home" style-name="margin: 0 10px;"></i-heroicons>
                    
                    <i-heroicons id="sound-on-btn" icon-name="sound-on" style-name="margin: 0 10px;"></i-heroicons>
                    <i-heroicons id="sound-off-btn" icon-name="sound-off" style-name="margin: 0 10px;"></i-heroicons>
                    
                    <i-heroicons id="maximize-btn" icon-name="maximize" style-name="margin: 0 10px;"></i-heroicons>
                    <i-heroicons id="minimize-btn" icon-name="minimize" style-name="margin: 0 10px;"></i-heroicons>
                </div>
    
                <div style="${isMobile ? 'font-size: 30px;' : 'font-size: 40px;'} margin-bottom: 25px;">pay table</div>
                <img style="width: ${isMobile ? '75%' : '50%'}; margin-bottom: 50px;" src="${$globals.assets.other['PaytableImage']}" alt="" />
                
                <div style="${isMobile ? 'font-size: 25px;' : 'font-size: 40px;'} margin-bottom: 25px;">symbols = bet x 2</div>
                <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 50px;">
                    ${$configs.SYMBOLS.map(symbol => {
                        const symbolName = symbol.replace(/\b\w/g, l => l.toUpperCase());
                        const imageUrl = $globals.assets.menu[`${symbolName}Icon`].textureCacheIds[0];
                        return `<img style="width: calc((100% / 6))" src="${imageUrl}" alt="" />`;
                    }).join('')}
                </div>
                
                <div style="${isMobile ? 'font-size: 25px;' : 'font-size: 40px;'} margin-bottom: 25px;">jolly = bet x 3</div>
                <div style="margin-bottom: 50px;">
                    <img style="width: calc((100% / 6))" src="${$globals.assets.menu['SplashIcon'].textureCacheIds[0]}" alt="" />
                </div>
    
                <div style="${isMobile ? 'font-size: 25px;' : 'font-size: 40px;'} margin-bottom: 25px;">mega win = bet x 5</div>
                <div>
                    <img style="width: calc((100% / 6))" src="${$globals.assets.menu['FruitcocktailIcon'].textureCacheIds[0]}" alt="" />
                </div>
            </div>
        `;

        Object.assign(this.menu.style, style);
        this.menu.style.display = 'none';

        document.body.appendChild(this.menu);
        this.setting.element.addEventListener('click', this.menuHandler.bind(this));
        document.getElementById('close-btn').addEventListener('click', this.menuHandler.bind(this));

        this.betHandler();
        this.homeHandler();
        this.fullscreenHandler();
        this.audioHandler();
    }

    menuHandler() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) this.menu.style.display = 'block';
        if (!this.isOpen) this.menu.style.display = 'none';
    }

    betHandler() {
        const betDecreaseBtn = document.getElementById('bet-decrease-btn');
        const betIncreaseBtn = document.getElementById('bet-increase-btn');
        const betValue = document.getElementById('bet-value');

        betDecreaseBtn.addEventListener('click', () => {
            if ($configs.USER.BET <= $configs.USER.MIN_BET) return;

            $configs.USER.BET -= $configs.USER.BET_INCREMENT;
            betValue.innerText = $configs.USER.BET.toString();
        });

        betIncreaseBtn.addEventListener('click', () => {
            if ($configs.USER.BET >= $configs.USER.MAX_BET) return;

            $configs.USER.BET += $configs.USER.BET_INCREMENT;
            betValue.innerText = $configs.USER.BET.toString();
        })
    }

    homeHandler() {
        const homeBtn = document.getElementById('home-btn');

        const isIframe = window.self !== window.top;

        homeBtn.addEventListener('click', () => {
            if (isIframe) {
                // message to frame
            } else {
                const url = 'https://0xbrax.dev';
                window.open(url, '_blank');
            }
        });
    }

    fullscreenHandler() {
        const maximizeBtn = document.getElementById('maximize-btn');
        const minimizeBtn = document.getElementById('minimize-btn');


        if (!isMobile) {
            maximizeBtn.style.display = 'none';
            minimizeBtn.style.display = 'none';

            return;
        }

        minimizeBtn.style.display = 'none';

        maximizeBtn.addEventListener('click', () => {
            enterFullscreen();
            $globals.isFullscreenActive = true;

            maximizeBtn.style.display = 'none';
            minimizeBtn.style.display = 'inline-block';
        });

        minimizeBtn.addEventListener('click', () => {
            exitFullscreen();
            $globals.isFullscreenActive = false;

            minimizeBtn.style.display = 'none';
            maximizeBtn.style.display = 'inline-block';
        });
    }

    audioHandler() {
        const soundOnBtn = document.getElementById('sound-on-btn');
        const soundOffBtn = document.getElementById('sound-off-btn');

        soundOnBtn.style.display = 'none';

        soundOnBtn.addEventListener('click', () => {
            Howler.mute(false);
            $globals.isAudioActive = true;

            soundOnBtn.style.display = 'none';
            soundOffBtn.style.display = 'inline-block';
        });

        soundOffBtn.addEventListener('click', () => {
            Howler.mute(true);
            $globals.isAudioActive = false;

            soundOffBtn.style.display = 'none';
            soundOnBtn.style.display = 'inline-block';
        });
    }
}