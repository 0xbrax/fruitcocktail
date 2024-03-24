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

// Need to verify at least 2 random reels, starting from reel number 2
export const getLose = (indexes) => {
    const IDXs = Object.assign(indexes);

    for (let i = 1; i <= $configs.REELS; i++) {
        IDXs[`REEL_${i}`] = getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1);
    }

    const firstReelToCheck = getPseudoRandomNumber(2, $configs.REELS);
    let secondReelToCheck;
    do secondReelToCheck = getPseudoRandomNumber(2, $configs.REELS);
    while (firstReelToCheck === secondReelToCheck);

    const getNewReelIndex = (reelNumber) => {
        const symbolReel1 = $configs.MAP.REEL_1[IDXs.REEL_1];

        let newIndex = IDXs[`REEL_${reelNumber}`];
        while ($configs.MAP[`REEL_${reelNumber}`][newIndex] === symbolReel1 || $configs.MAP[`REEL_${reelNumber}`][newIndex] === $configs.JOLLY) {
            newIndex = getCryptoRandomNumber(0, $configs.REEL_LENGTH - 1);
        }

        return newIndex;
    }

    IDXs[`REEL_${firstReelToCheck}`] = getNewReelIndex(firstReelToCheck);
    IDXs[`REEL_${secondReelToCheck}`] = getNewReelIndex(secondReelToCheck);

    console.log('LOG.....', IDXs[`REEL_${firstReelToCheck}`])

    return IDXs;
}

// 1 symbol only is different from pay table
export const getFakeWin = (indexes) => {
    let IDXs = Object.assign(indexes);

    const symbolsWithoutJolly = [...$configs.SYMBOLS, $configs.MEGA_WIN];
    const randomSymbol = symbolsWithoutJolly[getCryptoRandomNumber(0, symbolsWithoutJolly.length - 1)];

    for (let i = 0; i < $configs.REELS; i++) {
        const reelNumber = i + 1;
        IDXs[`REEL_${reelNumber}`] = $configs.MAP[`REEL_${reelNumber}`].indexOf(randomSymbol);
    }

    const randomReel = getPseudoRandomNumber(1, $configs.REELS);
    let randomLoseIndex = $configs.MAP[`REEL_${randomReel}`].indexOf(randomSymbol);

    while ($configs.MAP[`REEL_${randomReel}`][randomLoseIndex] === randomSymbol || $configs.MAP[`REEL_${randomReel}`][randomLoseIndex] === $configs.JOLLY) {
        const newIndex = getPseudoRandomNumber(0, $configs.REEL_LENGTH - 1);
        const newSymbol = $configs.MAP[`REEL_${randomReel}`][newIndex];
        randomLoseIndex = $configs.MAP[`REEL_${randomReel}`].indexOf(newSymbol);
    }

    IDXs[`REEL_${randomReel}`] = randomLoseIndex;
    IDXs = getRandomWinMap(IDXs);

    return IDXs;
}