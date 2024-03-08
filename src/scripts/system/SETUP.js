export const $configs = {
    REELS: 5,
    REEL_LENGTH: 8,
    REEL_SYMBOL_VIEWS: 3,
    SYMBOL_SIZE: 440,
    SYMBOLS: ['apple', 'cherry', 'coconut', 'grapefruit', 'lemon', 'watermelon'],
    JOLLY: 'splash',
    MEGA_WIN: 'fruitcocktail',
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
};