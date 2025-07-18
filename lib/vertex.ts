import { Set } from 'immutable';
import { NORTH, EAST, SOUTH, WEST } from './point';

const dirsOrder = [NORTH, EAST, SOUTH, WEST] as const;

type Dir = NORTH | EAST | SOUTH | WEST;

function dirToChar(dir: Dir) {
  switch (dir) {
    case NORTH:
      return 'N';
    case EAST:
      return 'E';
    case SOUTH:
      return 'S';
    case WEST:
      return 'W';
    default:
      throw new Error('Unknown direction encountered');
  }
}

export const RENDER_MAP = {
  NESW: '┼',
  NES: '├',
  NEW: '┴',
  NSW: '┤',
  ESW: '┬',
  NE: '└',
  NS: '│',
  NW: '┘',
  ES: '┌',
  EW: '─',
  SW: '┐',
  N: '╵',
  E: '╶',
  S: '╷',
  W: '╴',
  '': '.',
} as const;

// Vertex Class Definition
// ------------------------------------------------------------------------------------------------

/**
 * Vertex.
 *
 * Represents a corner point in a grid.
 */
class Vertex {
  constructor(private readonly nesw: Set<Dir>) {}

  add(dir: Dir) {
    return new Vertex(this.nesw.add(dir));
  }

  toString() {
    const key = dirsOrder
      .filter((d) => this.nesw.has(d))
      .map(dirToChar)
      .join('') as keyof typeof RENDER_MAP;
    return RENDER_MAP[key];
  }
}

export type { Vertex };

export const emptyVertex = new Vertex(Set());
