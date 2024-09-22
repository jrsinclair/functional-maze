import { describe, expect } from 'vitest';
import { Set } from 'immutable';
import { line } from './line';
import { p } from './point';
import { fc, it } from '@fast-check/vitest';
import { connectionsToRooms } from './render.ts';
import { mazeImproved } from './main.ts';

const smallMazeLines = Set([
    line(p(0, 0), p(1, 0)),
    line(p(0, 0), p(0, 1)),
    line(p(0, 1), p(1, 1)),
]);
const smallMazeRooms = [
    [{ doors: ['EAST', 'SOUTH'] }, { doors: ['WEST'] }],
    [{ doors: ['NORTH', 'EAST'] }, { doors: ['WEST'] }],
];

describe('connectionsToRooms()', () => {
    it.each`
        input             | expected
        ${smallMazeLines} | ${smallMazeRooms}
    `('should give back the expected result', ({ input, expected }) => {
        const actual = connectionsToRooms(input);
        expect(actual).toEqual(expected);
    });

    it.prop([fc.nat({ max: 50 }), fc.integer()])(
        'should always produce between 1-4 exits from each room',
        (n, seed) => {
            const connections = mazeImproved(seed, n);
            const actual = connectionsToRooms(connections);
            actual.forEach((row) => {
                row.forEach((room) => {
                    expect(room.doors.length).toBeGreaterThan(0);
                    expect(room.doors.length).toBeLessThanOrEqual(4);
                });
            });
        },
    );
});
