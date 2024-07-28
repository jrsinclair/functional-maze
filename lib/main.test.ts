import { describe, expect } from 'vitest';
import { it, fc } from '@fast-check/vitest';
import { Set } from 'immutable';
import { type Point, p } from './point';
import { type Line } from './line';
import { maze } from './main';
import { randomInRange } from './util';

function connectedPoints(lines: Set<Line>, graphA = Set<Point>(), graphB = Set<Point>()) {
    if (lines.size === 0) return [graphA, graphB] as const;
    const linesConnectedToGraphA = lines.filter(({ a, b }) => graphA.has(a) || graphA.has(b));
    const linesConnectedToGraphB = lines.filter(({ a, b }) => graphB.has(a) || graphB.has(b));

    const newGraphA = graphA.union(linesConnectedToGraphA.flatMap(({ a, b }) => Set([a, b])));
    const newGraphB = graphB.union(linesConnectedToGraphB.flatMap(({ a, b }) => Set([a, b])));

    return connectedPoints(
        lines.subtract(linesConnectedToGraphA, linesConnectedToGraphB),
        newGraphA,
        newGraphB,
    );
}

describe('maze()', () => {
    it.prop([fc.integer({ min: 2, max: 30 }), fc.integer()])(
        'should always return the same maze given the same seed',
        (n, seed) => {
            const m1 = maze(n, seed);
            const m2 = maze(n, seed);
            expect(m1).toEqual(m2);
        },
    );

    it.prop([fc.integer({ min: 2, max: 30 }), fc.integer()])(
        'should always return two connected sets of points that never cross',
        (n, seed) => {
            const m = maze(n, seed);
            const p1 = p(0, 0);
            const p2 = p(n - 1, n - 1);
            const [graphA, graphB] = connectedPoints(m, Set([p1]), Set([p2]));
            const intersect = graphA.intersect(graphB);
            expect(intersect.size).toBe(0);
        },
    );

    it.prop([fc.integer({ min: 2, max: 30 }), fc.integer()])(
        'should always produce a set of lines where each line is of length 1',
        (n, seed) => {
            const lines = maze(n, seed);
            lines.forEach(({ a, b }) => {
                expect(Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2)).toBe(1);
            });
        },
    );
});

describe('randomInRange()', () => {
    it.prop([fc.integer(), fc.integer({ min: 1, max: 2 ** 31 })])(
        'should always produce an integer between 0 and n - 1',
        (seed, n) => {
            const [, actual] = randomInRange(seed, n);
            expect(Number.isInteger(n)).toBe(true);
            expect(actual).toBeLessThanOrEqual(n - 1);
            expect(actual).toBeGreaterThanOrEqual(0);
        },
    );
});
