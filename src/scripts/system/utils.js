export const $globals = {
    assets: {},
    scene: null
};

export const isMobile = !window.matchMedia('screen and (min-width: 576px)').matches;

export const getPseudoRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getCryptoRandomNumber = (min, max) => {
    const range = max - min + 1;
    const maxRange = 256;
    if (min < 0 || max >= maxRange || range > maxRange) {
        throw new Error(`Il tuo intervallo deve essere tra 0 e ${maxRange - 1} con un massimo intervallo di ${maxRange}.`);
    }

    const bytes = new Uint8Array(1);
    let randomNumber;
    do {
        window.crypto.getRandomValues(bytes);
        randomNumber = bytes[0];
    } while (randomNumber >= Math.floor(maxRange / range) * range);

    return min + (randomNumber % range);
}