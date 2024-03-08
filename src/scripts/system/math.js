import { getCryptoRandomNumber, getPseudoRandomNumber } from "./utils.js";

// PAY TABLE => 9 Maps, index reel is always in the middle row before win map
export const getRandomWinMap = ({ indexReel1, indexReel2, indexReel3, indexReel4, indexReel5 }) => {
    const maps = [
        {
            indexReel1: indexReel1 - 1,
            indexReel2: indexReel2 - 1,
            indexReel3: indexReel3,
            indexReel4: indexReel4 - 1,
            indexReel5: indexReel5 - 1
        },
        {
            indexReel1: indexReel1 + 1,
            indexReel2: indexReel2 + 1,
            indexReel3: indexReel3,
            indexReel4: indexReel4 + 1,
            indexReel5: indexReel5 + 1
        },
        {
            indexReel1: indexReel1,
            indexReel2: indexReel2 - 1,
            indexReel3: indexReel3 - 1,
            indexReel4: indexReel4 - 1,
            indexReel5: indexReel5
        },
        {
            indexReel1: indexReel1,
            indexReel2: indexReel2 + 1,
            indexReel3: indexReel3 + 1,
            indexReel4: indexReel4 + 1,
            indexReel5: indexReel5
        },
        {
            indexReel1: indexReel1 - 1,
            indexReel2: indexReel2 - 1,
            indexReel3: indexReel3 - 1,
            indexReel4: indexReel4 - 1,
            indexReel5: indexReel5 - 1
        },
        {
            indexReel1: indexReel1,
            indexReel2: indexReel2,
            indexReel3: indexReel3,
            indexReel4: indexReel4,
            indexReel5: indexReel5
        },
        {
            indexReel1: indexReel1 + 1,
            indexReel2: indexReel2 + 1,
            indexReel3: indexReel3 + 1,
            indexReel4: indexReel4 + 1,
            indexReel5: indexReel5 + 1
        },
        {
            indexReel1: indexReel1 - 1,
            indexReel2: indexReel2,
            indexReel3: indexReel3 + 1,
            indexReel4: indexReel4,
            indexReel5: indexReel5 - 1
        },
        {
            indexReel1: indexReel1 + 1,
            indexReel2: indexReel2,
            indexReel3: indexReel3 - 1,
            indexReel4: indexReel4,
            indexReel5: indexReel5 + 1
        }
    ];

    const random = getCryptoRandomNumber(0, maps.length - 1);
    return maps[random];
}

// 2 symbols are different from win symbol. Need to verify at least 2 random reels, starting from reel number 2
export const getRandomLose = (indexReels, reelsXSlot, allSymbols, slotMap) => {
    const obj = Object.assign(indexReels);

    for (let i = 1; i <= reelsXSlot; i++) {
        obj[`indexReel${i}`] = getPseudoRandomNumber(0, allSymbols.length - 1);
    }

    const checkReelIndex1 = getPseudoRandomNumber(2, reelsXSlot);
    let checkReelIndex2;
    do checkReelIndex2 = getPseudoRandomNumber(2, reelsXSlot);
    while (checkReelIndex1 === checkReelIndex2);

    const getNewReelIndex = (id) => {
        const symbolReel1 = slotMap.REEL_1_MAP[obj.indexReel1];
        let randomNumber = getPseudoRandomNumber(0, allSymbols.length - 1);
        while (allSymbols[randomNumber] === 'splash') {
            randomNumber = getPseudoRandomNumber(0, allSymbols.length - 1);
        }
        const whatSymbolIndexInReel = slotMap[`REEL_${id}_MAP`].indexOf(symbolReel1);
        let diffIndex = Math.abs(randomNumber - whatSymbolIndexInReel);

        // Get out of win map
        while (diffIndex <= 1) {
            randomNumber = getPseudoRandomNumber(0, allSymbols.length - 1);
            diffIndex = Math.abs(randomNumber - whatSymbolIndexInReel);
        }

        return randomNumber;
    }

    obj[`indexReel${checkReelIndex1}`] = getNewReelIndex(checkReelIndex1);
    obj[`indexReel${checkReelIndex2}`] = getNewReelIndex(checkReelIndex2);

    return obj;
}

// 1 symbol only is different from win symbol
export const getRandomFakeWin = (indexReels, reelsXSlot, symbolsWithoutJolly, slotMap, randomWinSymbol) => {
    const obj = Object.assign(indexReels);

    const randomReel = getPseudoRandomNumber(1, reelsXSlot);
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
}