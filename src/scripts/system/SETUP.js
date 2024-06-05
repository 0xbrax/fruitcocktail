export const DISCLAIMER_TEXT = `This slot machine project is a purely demonstrative and educational exercise developed for showcasing JavaScript programming skills.
    The virtual currency used within the slot machine has no real-world value and is intended for entertainment purposes only.
    This project does not involve real money transactions, and its primary purpose is to highlight coding and design capabilities.
    Any resemblance to actual gambling activities is coincidental.
    By interacting with this project, users acknowledge that the in-game currency is entirely fictional, and no actual financial transactions are taking place.
    The developer assumes no responsibility for the misuse or misinterpretation of this project.
    Viewer discretion is advised.`;

export const $configs = {
    REELS: 5,
    REEL_LENGTH: 8,
    REEL_SYMBOL_VIEWS: 3,
    SYMBOL_SIZE: 440,
    SYMBOLS: ['apple', 'cherry', 'coconut', 'grapefruit', 'lemon', 'watermelon'],
    JOLLY: 'splash',
    MEGA_WIN: 'fruitcocktail',
    ALL_SYMBOLS: ['apple', 'cherry', 'coconut', 'grapefruit', 'lemon', 'watermelon', 'splash', 'fruitcocktail'],
    MAP: {
        REEL_1: ['lemon', 'coconut', 'watermelon', 'cherry', 'fruitcocktail', 'splash', 'grapefruit', 'apple'],
        REEL_2: ['apple', 'cherry', 'coconut', 'fruitcocktail', 'grapefruit', 'lemon', 'splash', 'watermelon'],
        REEL_3: ['fruitcocktail', 'grapefruit', 'cherry', 'coconut', 'splash', 'watermelon', 'apple', 'lemon'],
        REEL_4: ['watermelon', 'splash', 'lemon', 'grapefruit', 'fruitcocktail', 'coconut', 'cherry', 'apple'],
        REEL_5: ['apple', 'grapefruit', 'splash', 'fruitcocktail', 'cherry', 'watermelon', 'coconut', 'lemon']
    },
    CONDITIONS: [...Array(4).fill('lose'), ...Array(6).fill('fake-win'), ...Array(10).fill('win'), ...Array(1).fill('mega-win')],
    SELECTED_CONDITION: null,
    SELECTED_SYMBOL: null,
    JOLLY_RATIO: [1, ...Array(4).fill(0)], // 1 => true, 0 => false
    JOLLY_REEL: null,
    USER: {
        BALANCE: 1_000_000,
        BET: 200,
        MIN_BET: 100,
        MAX_BET: 1_000,
        BET_INCREMENT: 100
    }
};

export const $style = {
    black: '000000',
    white: 'ffffff',
    main: 'f36300',
    mainRGB: '243, 99, 0',
    secondary: 'be0100',
    special: 'fecd00'
}