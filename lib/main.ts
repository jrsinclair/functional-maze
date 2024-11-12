import { Set, List, Map } from 'immutable';
import { line, type Line } from './line';
import { p, type Point, addPoint, NORTH, SOUTH, EAST, WEST } from './point';
import { randomInRange } from './util';

//
// Maze building functions
// ------------------------------------------------------------------------------------------------

function buildInitialState(n: number, seed0: number) {
  const mazeGrid: [Point, List<Point>][] = new Array(n);
  const emptyList = List<Point>();
  for (let i = 0; i < n ** 2; i++) {
    mazeGrid[i] = [p(i % n, Math.floor(i / n)), emptyList];
  }
  const [seed1, idx] = randomInRange(seed0, n ** 2);
  const startingRoom = mazeGrid[idx][0];
  return [startingRoom, Map(mazeGrid), seed1] as const;
}

function getCandidates(room: Point, maze: Map<Point, List<Point>>) {
  return [NORTH, SOUTH, EAST, WEST].map(addPoint(room)).filter((pt) => maze.get(pt)?.size === 0);
}

function buildMaze(room: Point, mazeSoFar: Map<Point, List<Point>>, seed0: number) {
  // Find adjacent unconnected rooms.
  const candidates = getCandidates(room, mazeSoFar);
  if (candidates.length === 0) {
    return [mazeSoFar, seed0] as const;
  }

  // Pick a room from the list of candidates.
  const [seed1, idx] = randomInRange(seed0, candidates.length);
  const newRoom = candidates[idx];

  // Move to the newly connected room.
  const [newMaze, seed2] = buildMaze(
    newRoom,
    mazeSoFar
      .set(room, mazeSoFar.get(room)!.push(newRoom))
      .set(newRoom, mazeSoFar.get(newRoom)!.push(room)),
    seed1,
  );

  // There may still be other directions we can connect
  // to this room, so we call buildMaze() again.
  return buildMaze(room, newMaze, seed2);
}

export function maze(n: number, seed0 = Date.now()) {
  const [room, mazeGrid, seed1] = buildInitialState(n, seed0);
  const [mz] = buildMaze(room, mazeGrid, seed1);
  return mz;
}

//
// Older Rendering functions
// ------------------------------------------------------------------------------------------------

export function renderMazeAscii(n: number, lines: List<Line>): string {
  const mutableArray = new Array(n * 2).fill(undefined).map((_) => new Array(n * 2).fill(' '));
  return lines
    .reduce((arr, { a, b }) => {
      arr[a.y * 2][a.x * 2] = '+';
      arr[b.y * 2][b.x * 2] = '+';
      if (b.x > a.x) arr[a.y * 2][a.x * 2 + 1] = '-';
      if (b.y > a.y) arr[a.y * 2 + 1][a.x * 2] = '|';
      return arr;
    }, mutableArray)
    .map((row) => row.join(''))
    .join('\n');
}

const RENDER_MAP = {
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

const NESW = [
  ['N' as const, NORTH] as const,
  ['E' as const, EAST] as const,
  ['S' as const, SOUTH] as const,
  ['W' as const, WEST] as const,
];

const xyToChar = (x: number, y: number, lines: List<Line>) => {
  const pt = p(x, y);
  const idx = NESW.map(([c, dir]) => [c, line(pt, addPoint(pt)(dir))] as const)
    .filter(([, line]) => lines.includes(line))
    .map(([c]) => c)
    .join('') as keyof typeof RENDER_MAP;
  return RENDER_MAP[idx];
};

export function renderMazeText(n: number, lines: List<Line> | Set<Line>): string {
  return new Array(n)
    .fill(undefined)
    .map(() => new Array(n).fill(' '))
    .map((row, y) => row.map((_, x) => xyToChar(x, y, lines.toList())).join(''))
    .join('\n');
}

export function renderMazeSVG(n: number, squareSize: number, lines: List<Line>): string {
  const diagSize = (n + 1) * squareSize;
  const paths = lines
    .map(({ a, b }) => {
      const pxA = (a.x + 1) * squareSize;
      const pxB = (b.x + 1) * squareSize;
      const pyA = (a.y + 1) * squareSize;
      const pyB = (b.y + 1) * squareSize;
      return `<path d="M ${pxA} ${pyA} L ${pxB} ${pyB}" stroke="currentColor" stroke-width="1" />`;
    })
    .join('\n');
  return `<svg width="${diagSize}" height="${diagSize}" viewBox="0 0 ${diagSize} ${diagSize}">
    <g class="mazebg">${paths}</g>
    </svg>`;
}
