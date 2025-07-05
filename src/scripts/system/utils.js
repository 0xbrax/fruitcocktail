import { gsap } from 'gsap';
import { PROBABILITY_MIN_MULTIPLIER, PROBABILITY_UNIT_DIVISOR } from '@/scripts/system/SETUP.js';

export const $globals = {
    assets: {},
    sceneManager: null,
    isAudioActive: true,
    isFullscreenActive: false,
    isWakelockActive: false,
};

export const isMobile = !window.matchMedia('screen and (min-width: 576px)').matches;

export const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        screen.orientation.lock('portrait-primary'); // auto unlock
        $globals.isFullscreenActive = true;
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
        screen.orientation.lock('portrait-primary'); // auto unlock
        $globals.isFullscreenActive = true;
    }
};
export const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
        $globals.isFullscreenActive = false;
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        $globals.isFullscreenActive = false;
    }
};

export const getPseudoRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getCryptoRandomNumber = (min, max) => {
    const range = max - min + 1;
    const maxRange = 256;
    if (min < 0 || max >= maxRange || range > maxRange) {
        throw new Error(`Your range must be between 0 and ${maxRange - 1} with a maximum range of ${maxRange}.`);
    }

    const bytes = new Uint8Array(1);
    let randomNumber;
    do {
        window.crypto.getRandomValues(bytes);
        randomNumber = bytes[0];
    } while (randomNumber >= Math.floor(maxRange / range) * range);

    return min + (randomNumber % range);
};

export const getWeightedRandomItem = (items, normalizedItems) => {
    if (items.map((item) => item.probability).reduce((partialSum, a) => partialSum + a, 0,) !== 100) {
        throw new Error("ALERT !!! --> Probability sum is not 100");
    }
    items.map((item) => item.probability).forEach((item) => {
        if (item % PROBABILITY_UNIT_DIVISOR !== 0) {
            throw new Error("ALERT !!! --> Check divisor and multiplier");
        }
    });

    let threshold = getCryptoRandomNumber(1, 100 * PROBABILITY_MIN_MULTIPLIER);

    for (const item of normalizedItems) {
        threshold -= item.probability;
        if (threshold <= 0) {
            return item;
        }
    }
};

export const probabilityDebug = (items, normalizedItems, requests = 10_000) => {
    const test = {};

    items.forEach((item) => {
        test[item.id] = {
            id: item.id,
            value: item.value,
            counter: 0,
        };
    });

    for (let i = 0; i < requests; i++) {
        const item = getWeightedRandomItem(normalizedItems);
        test[item.id].counter++;
    }
    Object.keys(test).forEach((key) => {
        test[key].probability = test[key].counter * 100 / requests;
        test[key].expected = items.find((el) =>
          el.id === parseInt(key)
        ).probability;
    });
    console.log(
      "---------------- PROBABILITY DEBUG - - - - > > > > Total request: ",
      requests,
      "\n",
      test,
      "\n ---------------- ---------------- ---------------- ----------------",
    );
};



export const verticalLoop = (items, reelContainer, elementsHeightWrap, gap, config) => {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
            repeat: config.repeat,
            paused: config.paused,
            defaults: { ease: 'none' },
        }),
        length = items.length,
        startY = items[length - 1].y + gap,
        times = [],
        heights = [],
        curIndex = 0,
        center = config.center,
        clone = (obj) => {
            let result = {},
                p;
            for (p in obj) {
                result[p] = obj[p];
            }
            return result;
        },
        timeOffset = 0,
        container = reelContainer,
        totalHeight = 0,
        populateHeights = () => {
            items.forEach((el, i) => {
                heights[i] = elementsHeightWrap[i];
                totalHeight += heights[i];
            });
        },
        timeWrap,
        populateOffsets = () => {
            timeOffset = center
                ? (tl.duration() * (container.width / 2)) /
                totalHeight
                : 0;
            center &&
            times.forEach((t, i) => {
                times[i] = timeWrap(
                    tl.labels['label' + i] +
                    (tl.duration() * heights[i]) /
                    2 /
                    totalHeight -
                    timeOffset
                );
            });
        },
        populateTimeline = () => {
            let i, item, curY, distanceToStart, distanceToLoop;
            tl.clear();
            for (i = 0; i < length; i++) {
                item = items[i];

                curY = item.y;
                distanceToStart = startY - curY;
                distanceToLoop = distanceToStart - gap;
                tl.to(
                    item,
                    {
                        y: curY + distanceToLoop,
                        duration: distanceToLoop
                    },
                    0
                )
                    .fromTo(
                        item,
                        {
                            y: curY + distanceToLoop - totalHeight
                        },
                        {
                            y: curY,
                            duration: totalHeight - distanceToLoop,
                            immediateRender: false,
                        },
                        distanceToLoop
                    )
                    .add(
                        'label' + i,
                        distanceToStart
                    );
                timeWrap = gsap.utils.wrap(0, tl.duration());
                times[i] = timeWrap(
                    tl.labels['label' + i] +
                    (tl.duration() * heights[i]) /
                    2 /
                    totalHeight -
                    timeOffset
                );
            }
        };
    populateHeights();
    populateTimeline();
    populateOffsets();
    function toIndex(index, vars) {
        vars = clone(vars);
        index -= 2; // End gap => show selected index on middle row
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (vars.revolutions) {
            time += tl.duration() * Math.round(vars.revolutions);
            delete vars.revolutions;
        }
        if (time < 0 || time > tl.duration()) {
            vars.modifiers = { time: timeWrap };
        }
        curIndex = newIndex;
        vars.overwrite = true;

        return tl.tweenTo(time, vars);
    }
    //tl.elements = items;
    //tl.next = (vars) => toIndex(curIndex + 1, vars);
    //tl.previous = (vars) => toIndex(curIndex - 1, vars);
    //tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.progress(1, true).progress(0, true); // pre-render for performance

    return tl;
}