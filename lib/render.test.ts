import { fc, it } from '@fast-check/vitest';
import { List, Set } from 'immutable';
import { describe, expect } from 'vitest';
import { Line, line } from './line';
import { maze } from './main';
import { addPoint, EAST, NORTH, p, SOUTH, WEST } from './point';
import { graphToWalls, renderMazeText } from './render';
import { RENDER_MAP } from './vertex';

const NESW = [
  ['N' as const, NORTH] as const,
  ['E' as const, EAST] as const,
  ['S' as const, SOUTH] as const,
  ['W' as const, WEST] as const,
];

// Legacy text renderer used for comparison with new version.
// ------------------------------------------------------------------------------------------------

const xyToChar = (x: number, y: number, lines: List<Line>) => {
  const pt = p(x, y);
  const idx = NESW.map(([c, dir]) => [c, line(pt, addPoint(pt)(dir))] as const)
    .filter(([, line]) => lines.includes(line))
    .map(([c]) => c)
    .join('') as keyof typeof RENDER_MAP;
  return RENDER_MAP[idx];
};

export function renderMazeTextOld(n: number, lines: List<Line> | Set<Line>): string {
  const linesAsList = lines.toList();
  return new Array(n)
    .fill(undefined)
    .map(() => new Array(n).fill(' '))
    .map((row, y) => row.map((_, x) => xyToChar(x, y, linesAsList)).join(''))
    .join('\n');
}

// Actual test
// ------------------------------------------------------------------------------------------------

describe('renderMazeText', () => {
  it.prop([fc.integer({ min: 4, max: 36 }), fc.integer()], { numRuns: 20 })(
    'should always be faster than the old renderMazeText()',
    (size, seed) => {
      const rooms = maze(size, seed);
      const p0 = process.hrtime.bigint();
      const walls = graphToWalls(rooms);
      const textA = renderMazeTextOld(size + 1, walls);
      const p1 = process.hrtime.bigint();
      const textB = renderMazeText(size, rooms);
      const p2 = process.hrtime.bigint();

      expect(textA).toEqual(textB);
      expect(p1 - p0).toBeGreaterThan(p2 - p1);
    },
  );
});
