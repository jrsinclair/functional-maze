export const M = 0x80000000;
export const A = 1103515245;
export const C = 12345;

export function randomInt(seed: number) {
    return (A * seed + C) % M;
}

export function randomInRange(seed: number, maxInt: number) {
    const rand = randomInt(seed);
    return [rand, Math.floor((rand / M) * maxInt)];
}
