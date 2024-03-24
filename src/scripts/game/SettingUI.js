import { Button } from "./Button.js";
import { isMobile, $globals } from "../system/utils.js";
import { $style } from "../system/SETUP.js";
import { $configs } from "../system/SETUP.js";

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

    createMenu() {
        this.menu = document.createElement('div');
        this.menu.id = 'menu';
        const style = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: '99',
            top: '0',
            left: '0',
            padding: isMobile ? '25px' : '50px 200px',
            textAlign: 'center',
            overflow: 'auto',
            scrollBehavior: 'smooth',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: `#${$style.white}`,
            fontFamily: 'Rimbo-Regular'
        };

        this.menu.innerHTML = `
            TODO BALANCE
            
            
            <i-heroicons id="close-btn" icon-name="x-mark" style-name="position: fixed; ${isMobile ? 'top: 25px; right: 25px' : 'bottom: 50px; left: 50px'};"></i-heroicons>
        
            <div style="font-size: 50px; margin-bottom: 50px;">settings</div>
            
            <div style="font-size: 40px; margin-bottom: 25px;">bet</div>
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 25px;">
                <i-heroicons id="bet-decrease-btn" icon-name="minus"></i-heroicons>
                <span id="bet-value" style="font-size: 40px; line-height: 40px; margin: 0 20px;">${$configs.USER.BET}</span>
                <i-heroicons id="bet-increase-btn" icon-name="plus"></i-heroicons>
            </div>
            <div style="font-size: 30px; margin-bottom: 50px;">
                <div>free spin = min bet</div>
                <div>min bet = 100</div>
                <div>max bet = 1000</div>
            </div>
            
            <div style="font-size: 40px; margin-bottom: 25px;">configs</div>
            <div style="margin-bottom: 50px;">
                <i-heroicons icon-name="home"></i-heroicons>
                
                <i-heroicons icon-name="sound-on"></i-heroicons>
                <i-heroicons icon-name="sound-off"></i-heroicons>
                
                <i-heroicons icon-name="maximize"></i-heroicons>
                <i-heroicons icon-name="minimize"></i-heroicons>
            </div>

            <div style="font-size: 40px; margin-bottom: 25px;">pay table</div>
            <img style="width: 50%; margin-bottom: 50px;" src="${$globals.assets.menu['PaytableImage']}" />
            
            <div style="font-size: 40px; margin-bottom: 25px;">symbols = bet x 2</div>
            <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 50px;">
                ${$configs.SYMBOLS.map(symbol => {
                    const symbolName = symbol.replace(/\b\w/g, l => l.toUpperCase());
                    const imageUrl = $globals.assets.menu[`${symbolName}Icon`];
                    return `<img style="width: calc((100% / 6))" src="${imageUrl}" alt="" />`;
                }).join('')}
            </div>
            
            <div style="font-size: 40px; margin-bottom: 25px;">jolly = bet x 3</div>
            <div style="margin-bottom: 50px;">
                <img style="width: calc((100% / 6))" src="${$globals.assets.menu['SplashIcon']}" alt="" />
            </div>

            <div style="font-size: 40px; margin-bottom: 25px;">mega win = bet x 5</div>
            <div>
                <img style="width: calc((100% / 6))" src="${$globals.assets.menu['FruitcocktailIcon']}" alt="" />
            </div>
        `;

        Object.assign(this.menu.style, style);
        this.menu.style.display = 'none';

        document.body.appendChild(this.menu);
        this.setting.element.addEventListener('click', this.menuHandler.bind(this));
        document.getElementById('close-btn').addEventListener('click', this.menuHandler.bind(this));

        this.betHandler();
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
}