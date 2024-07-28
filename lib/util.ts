export const M = 0x80000000;
export const A = 1103515245;
export const C = 12345;

export function randomInt(seed: number) {
    return (A * seed + C) % M;
}

/**
 *
 * @param {number} seed The seed to use to generate
 *     the random number.
 * @param {number} n The size of the range. The
 *     generated number will be in the range 0
 *     to n - 1.
 * @returns {[number, number]} A pair of numbers. The
 *     first is a random integer to use as the next
 *     seed. The second is a random number in the
 *     specified range.
 */
export function randomInRange(seed: number, n: number): [number, number] {
    const nextSeed = Math.abs(randomInt(seed));
    if (n <= 1) return [nextSeed, 0];
    return [nextSeed, Math.floor((nextSeed / M) * n)];
}

export function range(n: number) {
    return new Array(n).fill(undefined).map((_, i) => i);
}

export function shuffle<T>(startSeed: number, initialArray: ReadonlyArray<T>): [number, T[]] {
    const array = initialArray.slice(0);
    let currentIndex = array.length;
    let seed = startSeed;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let [nextSeed, randomIndex] = randomInRange(seed, currentIndex);
        seed = nextSeed;
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return [seed, array];
}
