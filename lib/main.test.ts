import { describe, expect } from 'vitest';
import { it, fc } from '@fast-check/vitest';
import { maze } from './main';
import { randomInRange } from './util';

describe('maze()', () => {
  it.prop([fc.integer({ min: 2, max: 30 }), fc.integer()])(
    'should always return the same maze given the same seed',
    (n, seed) => {
      const m1 = maze(n, seed);
      const m2 = maze(n, seed);
      expect(m1).toEqual(m2);
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
