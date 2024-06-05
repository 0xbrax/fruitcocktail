// preload
import LogoFullImage from '../../assets/image/logo-full_COMPRESSED.png';

// audio
import BackgroundMusicTrack from '../../assets/audio/sunny-fruit_strawberry_COMPRESSED.mp3';
import SlotClickSfx from '../../assets/audio/slot_click_COMPRESSED.mp3';
import SlotTickSfx from '../../assets/audio/slot_tick_COMPRESSED.mp3';
import SlotWinSfx from '../../assets/audio/slot_win_COMPRESSED.mp3';
import SlotMegaWinSfx from '../../assets/audio/slot_mega-win_COMPRESSED.mp3';
import SlotWinJollySfx from '../../assets/audio/slot_win-jolly_COMPRESSED.mp3';
import SlotFreeSpinSfx from '../../assets/audio/slot_free-spin_COMPRESSED.mp3';

// body
import SlotBodyImage from '../../assets/image/reel_COMPRESSED.png';
import SlotCanopyImage from '../../assets/image/canopy_COMPRESSED.png';
import SlotLogoImage from '../../assets/image/logo_COMPRESSED.png';
import SlotSplashLeftImage from '../../assets/image/splash_left_COMPRESSED.png';
import SlotSplashRightImage from '../../assets/image/splash_right_COMPRESSED.png';
import BalanceImage from '../../assets/image/ui_balance_COMPRESSED.png';

import BubbleImage from '../../assets/image/bubble_COMPRESSED.png';

// symbols
const AppleSprite= new URL(`/src/assets/sprite/apple_spritesheet.json`, import.meta.url).href;
const CherrySprite = new URL(`/src/assets/sprite/cherry_spritesheet.json`, import.meta.url).href;
const CoconutSprite = new URL(`/src/assets/sprite/coconut_spritesheet.json`, import.meta.url).href;
const FruitcocktailSprite = new URL(`/src/assets/sprite/fruitcocktail_spritesheet.json`, import.meta.url).href;
const GrapefruitSprite = new URL(`/src/assets/sprite/grapefruit_spritesheet.json`, import.meta.url).href;
const LemonSprite = new URL(`/src/assets/sprite/lemon_spritesheet.json`, import.meta.url).href;
const SplashSprite = new URL(`/src/assets/sprite/splash_spritesheet.json`, import.meta.url).href;
const WatermelonSprite = new URL(`/src/assets/sprite/watermelon_spritesheet.json`, import.meta.url).href;

const CharacterMainSprite = new URL(`/src/assets/sprite/character-main_spritesheet.json`, import.meta.url).href;
const CharacterDrinkSprite = new URL(`/src/assets/sprite/character-drink_spritesheet.json`, import.meta.url).href;

// menu
import AppleIcon from '../../assets/icon/apple_COMPRESSED.png';
import CherryIcon from '../../assets/icon/cherry_COMPRESSED.png';
import CoconutIcon from '../../assets/icon/coconut_COMPRESSED.png';
import FruitcocktailIcon from '../../assets/icon/fruitcocktail_COMPRESSED.png';
import GrapefruitIcon from '../../assets/icon/grapefruit_COMPRESSED.png';
import LemonIcon from '../../assets/icon/lemon_COMPRESSED.png';
import SplashIcon from '../../assets/icon/splash_COMPRESSED.png';
import WatermelonIcon from '../../assets/icon/watermelon_COMPRESSED.png';

// other
import BackgroundVideo from "../../assets/video/back_COMPRESSED.mp4";
import PaytableImage from '../../assets/image/paytable_COMPRESSED.png';

export const assets = {
    preload: {
        LogoFullImage,
    },
    audio: {
        BackgroundMusicTrack,
        SlotClickSfx,
        SlotTickSfx,
        SlotWinSfx,
        SlotMegaWinSfx,
        SlotWinJollySfx,
        SlotFreeSpinSfx
    },
    body: {
        SlotBodyImage,
        SlotCanopyImage,
        SlotLogoImage,
        SlotSplashLeftImage,
        SlotSplashRightImage,
        BalanceImage,
        BubbleImage
    },
    symbols: {
        AppleSprite,
        CherrySprite,
        CoconutSprite,
        FruitcocktailSprite,
        GrapefruitSprite,
        LemonSprite,
        SplashSprite,
        WatermelonSprite
    },
    character: {
        CharacterMainSprite,
        CharacterDrinkSprite
    },
    menu: {
        AppleIcon,
        CherryIcon,
        CoconutIcon,
        FruitcocktailIcon,
        GrapefruitIcon,
        LemonIcon,
        SplashIcon,
        WatermelonIcon
    },
    other: {
        BackgroundVideo,
        PaytableImage
    }
};