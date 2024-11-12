import { describe, expect } from 'vitest';
import { Set } from 'immutable';
import { line } from './line';
import { p } from './point';
import { it } from '@fast-check/vitest';
import { connectionsToRooms } from './render.ts';

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
});
