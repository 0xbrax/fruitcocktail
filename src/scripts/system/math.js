import { getCryptoRandomNumber, getPseudoRandomNumber } from "./utils.js";
import { $configs } from "./SETUP.js";

// PAY TABLE => 9 Maps, index reel is always in the middle row before win map
export const getRandomWinMap = ({ REEL_1, REEL_2, REEL_3, REEL_4, REEL_5 }) => {
    const maps = [
        {
            REEL_1: REEL_1 - 1,
            REEL_2: REEL_2 - 1,
            REEL_3: REEL_3,
            REEL_4: REEL_4 - 1,
            REEL_5: REEL_5 - 1
        },
        {
            REEL_1: REEL_1 + 1,
            REEL_2: REEL_2 + 1,
            REEL_3: REEL_3,
            REEL_4: REEL_4 + 1,
            REEL_5: REEL_5 + 1
        },
        {
            REEL_1: REEL_1,
            REEL_2: REEL_2 - 1,
            REEL_3: REEL_3 - 1,
            REEL_4: REEL_4 - 1,
            REEL_5: REEL_5
        },
        {
            REEL_1: REEL_1,
            REEL_2: REEL_2 + 1,
            REEL_3: REEL_3 + 1,
            REEL_4: REEL_4 + 1,
            REEL_5: REEL_5
        },
        {
            REEL_1: REEL_1 - 1,
            REEL_2: REEL_2 - 1,
            REEL_3: REEL_3 - 1,
            REEL_4: REEL_4 - 1,
            REEL_5: REEL_5 - 1
        },
        {
            REEL_1: REEL_1,
            REEL_2: REEL_2,
            REEL_3: REEL_3,
            REEL_4: REEL_4,
            REEL_5: REEL_5
        },
        {
            REEL_1: REEL_1 + 1,
            REEL_2: REEL_2 + 1,
            REEL_3: REEL_3 + 1,
            REEL_4: REEL_4 + 1,
            REEL_5: REEL_5 + 1
        },
        {
            REEL_1: REEL_1 - 1,
            REEL_2: REEL_2,
            REEL_3: REEL_3 + 1,
            REEL_4: REEL_4,
            REEL_5: REEL_5 - 1
        },
        {
            REEL_1: REEL_1 + 1,
            REEL_2: REEL_2,
            REEL_3: REEL_3 - 1,
            REEL_4: REEL_4,
            REEL_5: REEL_5 + 1
        }
    ];

    const random = getCryptoRandomNumber(0, maps.length - 1);
    const map = maps[random];

    for (const key in map) {
        if (map[key] === -1) map[key] = $configs.REEL_LENGTH - 1;
        if (map[key] === $configs.REEL_LENGTH) map[key] = 0;
    }

    return map;
}

// 2 symbols are different from win symbol. Need to verify at least 2 random reels, starting from reel number 2
export const getRandomLose = (indexes) => {
    const obj = Object.assign(indexes);

    for (let i = 1; i <= $configs.REELS; i++) {
        obj[`indexReel${i}`] = getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1);
    }

    const checkReelIndex1 = getPseudoRandomNumber(2, $configs.REELS);
    let checkReelIndex2;
    do checkReelIndex2 = getPseudoRandomNumber(2, $configs.REELS);
    while (checkReelIndex1 === checkReelIndex2);

    const getNewReelIndex = (id) => {
        const symbolReel1 = $configs.MAP.REEL_1[obj.REEL_1];
        let randomNumber = getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1);
        while ($configs.ALL_SYMBOLS[randomNumber] === 'splash') {
            randomNumber = getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1);
        }
        const whatSymbolIndexInReel = $configs.MAP[`REEL_${id}`].indexOf(symbolReel1);
        let diffIndex = Math.abs(randomNumber - whatSymbolIndexInReel);

        // Get out of win map
        while (diffIndex <= 1) {
            randomNumber = getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1);
            diffIndex = Math.abs(randomNumber - whatSymbolIndexInReel);
        }

        return randomNumber;
    }

    obj[`indexReel${checkReelIndex1}`] = getNewReelIndex(checkReelIndex1);
    obj[`indexReel${checkReelIndex2}`] = getNewReelIndex(checkReelIndex2);

    return obj;
}

// 1 symbol only is different from win symbol
/*export const getRandomFakeWin = (indexReels, $configs.REELS, symbolsWithoutJolly, slotMap, randomWinSymbol) => {
    const obj = Object.assign(indexReels);

    const randomReel = getPseudoRandomNumber(1, $configs.REELS);
    const filteredSymbols = symbolsWithoutJolly.filter(el => el !== randomWinSymbol);

    let loseSymbol = filteredSymbols[getPseudoRandomNumber(0, filteredSymbols.length - 1)];
    let randomLoseIndex = slotMap[`REEL_${randomReel}_MAP`].indexOf(loseSymbol);
    let diffIndexSymbol = Math.abs(randomLoseIndex - obj[`indexReel${randomReel}`]);

    // Get out of win map
    while (diffIndexSymbol <= 1) {
        loseSymbol = filteredSymbols[getPseudoRandomNumber(0, filteredSymbols.length - 1)];
        randomLoseIndex = slotMap[`REEL_${randomReel}_MAP`].indexOf(loseSymbol);
        diffIndexSymbol = Math.abs(randomLoseIndex - obj[`indexReel${randomReel}`]);
    }

    obj[`indexReel${randomReel}`] = slotMap[`REEL_${randomReel}_MAP`].indexOf(loseSymbol);

    return obj;
}*/