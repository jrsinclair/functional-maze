import { List, Map } from 'immutable';
import { type Line, line } from './line';
import { type Point, p, EAST, NORTH, SOUTH, WEST, addPoint, subtractPoint } from './point';
import { emptyVertex } from './vertex';
import { repeat } from './util';

const directionToString = Map<Point, string>([
  [NORTH, 'north'],
  [EAST, 'east'],
  [SOUTH, 'south'],
  [WEST, 'west'],
]);

const DIRECTIONS = [NORTH, EAST, SOUTH, WEST] as const;

// ASCII text renderer
// ------------------------------------------------------------------------------------------------

const roomWall = (room: Point) => (direction: Point) => {
  switch (direction) {
    case NORTH:
      return line(p(room.x, room.y), p(room.x + 1, room.y));
    case EAST:
      return line(p(room.x + 1, room.y), p(room.x + 1, room.y + 1));
    case SOUTH:
      return line(p(room.x, room.y + 1), p(room.x + 1, room.y + 1));
    case WEST:
      return line(p(room.x, room.y), p(room.x, room.y + 1));
    default:
      throw new Error(`Received an unknown direction for a wall to face: ${direction}`);
  }
};

// Exported for testing. Used with legacy unicode renderer as well as ascii renderer.
export function graphToWalls(graph: Map<Point, List<Point>>): List<Line> {
  const walls: Line[] = [];
  graph.forEach((doors, room) => {
    const roomWalls = DIRECTIONS.filter((dir) => !doors.includes(addPoint(room)(dir))).map(
      roomWall(room),
    );
    walls.push(...roomWalls);
  });
  return List(walls);
}

/**
 *
 * @param n The size of the maze. The maze is always a square and n represents the number of rooms
 *   along one side of the square.
 * @param lines
 * @returns
 */
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

// Unicode text renderer
// ------------------------------------------------------------------------------------------------

/**
 * Render Maze Text.
 *
 * Renders the maze using unicode box drawing characters.
 *
 * @param n The size of the maze. The maze is always a square and n represents the number of rooms
 *   along one side of the square.
 * @param rooms A graph representation of the maze, as a map of rooms (x,y coordinates) to adjacent
 *   rooms (a list of x,y coordinates).
 * @returns A unicode representation of the maze.
 */
export function renderMazeText(n: number, rooms: Map<Point, List<Point>>): string {
  // Construct a 2D array with n + 1 rows and n + 1 columns.
  const emptyVertices = repeat(undefined, n + 1).map(() => repeat(emptyVertex, n + 1));
  const vertices = emptyVertices.map((row, y) =>
    row.map((vertex, x) => {
      // We are looking at the vertex at x,y. There are potentially rooms to the NW, NE, SE, and SW.
      const nwRoom = p(x - 1, y - 1);
      const neRoom = p(x, y - 1);
      const seRoom = p(x, y);
      const swRoom = p(x - 1, y);

      return (
        [
          [nwRoom, neRoom, NORTH], // If connection from the NW to NE room, add a north half-wall.
          [neRoom, seRoom, EAST], //  If connection from the NE to SE room, add an east half-wall.
          [seRoom, swRoom, SOUTH], // If connection from the SE to SW room, add a south half-wall.
          [swRoom, nwRoom, WEST], //  If connection from the SW to NW room, add a west half-wall.
        ] as const
      ).reduce((v, [a, b, dir]) => {
        // If at least one of the rooms is inside the maze and there is no connection between
        // them, add a half-wall.
        return (rooms.has(a) || rooms.has(b)) && !rooms.get(a)?.includes(b) ? v.add(dir) : v;
      }, vertex);
    }),
  );
  return vertices.map((row) => row.join('')).join('\n');
}

// Accessible renderer.
// ------------------------------------------------------------------------------------------------

const doorsToList = (doors: List<Point>, room: Point) => {
  return (
    '<ul class="door-list">' +
    doors
      .map((door) => {
        const direction = directionToString.get(subtractPoint(door)(room));
        return `<li class="door door-${direction}"><a class="doorLink" href="#room-${door.x}-${door.y}" title="Take the ${direction} door">${direction}</a></li>`;
      })
      .join('\n') +
    '</ul>'
  );
};

const doorsDescription = (doors: List<Point>, room: Point) => {
  const dirs = doors.map((door) => {
    const direction = directionToString.get(subtractPoint(door)(room));
    return direction;
  });
  return dirs.set(-1, (doors.size > 1 ? 'and ' : '') + dirs.get(-1)).join(', ');
};

/**
 * Rooms to List.
 *
 * Takes a maze graph representation and renders it as an HTML list.
 *
 * @param rooms  graph representation of the maze. That is, a map of rooms (Point objects) to
 *   adjacent rooms (a List of Point objects).
 * @returns An HTML string that represents the maze as an unordered list.
 */
export function roomsToList(rooms: Map<Point, List<Point>>) {
  return (
    '<ul class="room-list">' +
    rooms
      .sortBy((_, { x, y }) => Math.sqrt(x ** 2 + y ** 2))
      .map(
        (doors, room) =>
          `<li tabindex="0" class="maze-room" id="room-${room.x}-${room.y}">
          <p>Room ${room.x},${room.y}</p>
          <p>${doors.size === 1 ? 'There is a door' : 'There are doors'} to the
          ${doorsDescription(doors, room)}.</p>
          ${doorsToList(doors, room)}
         </li>`,
      )
      .join('\n') +
    '</ul>'
  );
}

// SVG Renderer
// ------------------------------------------------------------------------------------------------

/**
 * Render maze as SVG.
 *
 * @param n The size of the maze. The maze is always a square and n represents the number of rooms
 *   along one side of the square.
 * @param squareSize The size in pixels to draw each room.
 * @param rooms A graph representation of the maze. That is, a map of rooms (Point objects) to
 *   adjacent rooms (a List of Point objects).
 * @returns A string that will draw an SVG representation of the maze if converted to DOM elements.
 */
export function renderMazeSVG(n: number, squareSize: number, rooms: Map<Point, List<Point>>) {
  const diagSize = (n + 2) * squareSize;
  const wStart = squareSize;
  const wEnd = (n + 1) * squareSize;
  const northWall = `<path d="M ${wStart} ${wStart} L ${wEnd} ${wStart}" />`;
  const westWall = `<path d="M ${wStart} ${wStart} L ${wStart} ${wEnd}" />`;
  const wallLines = rooms
    .reduce((allWalls, doors, room) => {
      const walls = [SOUTH, EAST]
        .filter((dir) => !doors.includes(addPoint(dir)(room)))
        .map(addPoint(room))
        .map((adj) => [adj.x, adj.y, room.x + 1, room.y + 1])
        .map((pts) => pts.map((pt) => (pt + 1) * squareSize))
        .map(([ax, ay, bx, by]) => `<path d="M ${ax} ${ay} L ${bx} ${by}" />`);
      return allWalls.push(...walls);
    }, List<string>())
    .join('\n');
  return `<svg width="${diagSize}" height="${diagSize}" viewBox="0 0 ${diagSize} ${diagSize}">
     <g class="mazebg" stroke="currentColor" stroke-width="1">
      ${northWall}
      ${westWall}
      ${wallLines}
     </g>
    </svg>`;
}
