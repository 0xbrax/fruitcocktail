import { gsap } from 'gsap';

export const $globals = {
    assets: {},
    scene: null,
    isAudioActive: true,
};

export const isMobile = !window.matchMedia('screen and (min-width: 576px)').matches;

export const getPseudoRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
};

export const verticalLoop = (items, reelContainer, elementsHeightWrap, gap, config) => {
    items = gsap.utils.toArray(items);
    config = config || {};
    let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
            repeat: config.repeat,
            onUpdate:
                onChange &&
                function () {
                    let i = tl.closestIndex();
                    if (lastIndex !== i) {
                        lastIndex = i;
                        onChange(items[i], i);
                    }
                },
            paused: config.paused,
            defaults: { ease: 'none' },
            onReverseComplete: () =>
                tl.totalTime(tl.rawTime() + tl.duration() * 100),
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
        getClosest = (values, value, wrap) => {
            let i = values.length,
                closest = 1e10,
                index = 0,
                d;
            while (i--) {
                d = Math.abs(values[i] - value);
                if (d > wrap / 2) {
                    d = wrap - d;
                }
                if (d < closest) {
                    closest = d;
                    index = i;
                }
            }
            return index;
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
    tl.elements = items;
    tl.next = (vars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = (setCurrent) => {
        let index = getClosest(times, tl.time(), tl.duration());
        setCurrent && (curIndex = index);
        return index;
    };
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    tl.closestIndex(true);
    onChange && onChange(items[curIndex], curIndex);

    return tl;
}