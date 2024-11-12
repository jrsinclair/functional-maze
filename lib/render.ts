import { Set, List, Map } from 'immutable';
import { type Line, line } from './line';
import { type Point, p, EAST, NORTH, SOUTH, WEST, addPoint, subtractPoint } from './point';

type Room = { doors: Array<Point> };
type Rooms = Room[][];

const DIRECTIONS = [NORTH, EAST, SOUTH, WEST];

const directionToString = Map([
  [NORTH, 'north'],
  [EAST, 'east'],
  [SOUTH, 'south'],
  [WEST, 'west'],
]);

export function connectionsToRooms(connections: Set<Line>): Rooms {
  const roughSize = Math.sqrt(connections.size + 1);
  const rooms: Rooms = new Array(roughSize).fill(undefined).map(() => new Array(roughSize));
  connections.forEach(({ a, b }) => {
    if (!rooms[a.y][a.x]) rooms[a.y][a.x] = { doors: [] };
    if (!rooms[b.y][b.x]) rooms[b.y][b.x] = { doors: [] };
    const directionA = subtractPoint(b)(a);
    const directionB = subtractPoint(a)(b);
    rooms[a.y][a.x].doors.push(directionA);
    rooms[b.y][b.x].doors.push(directionB);
  });
  return rooms;
}

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

// Accessible renderer.
// ------------------------------------------------------------------------------------------------

const doorsToList = (doors: List<Point>, room: Point) => {
  return (
    '<ul class="door-list">' +
    doors
      .map((door) => {
        const direction = directionToString.get(subtractPoint(door)(room));
        return `<li class="door door-${direction}" ><a class="doorLink" href="#room-${door.x}-${door.y}" title="Take the ${direction} door">${direction}</a></li>`;
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

export const roomsToList = (rooms: Map<Point, List<Point>>) => {
  return (
    '<ul class="room-list">' +
    rooms
      .sortBy((_, { x, y }) => Math.sqrt(x ** 2 + y ** 2))
      .map(
        (doors, room) =>
          `<li tabindex="0" class="maze-room" id="room-${room.x}-${room.y}">
          <p>Room ${room.x},${room.y}</p>
          <p>${doors.size === 1 ? 'There is a door' : 'There are doors'} to the ${doorsDescription(
            doors,
            room,
          )}.</p>
          ${doorsToList(doors, room)}
         </li>`,
      )
      .join('\n') +
    '</ul>'
  );
};

// SVG Renderer
// ------------------------------------------------------------------------------------------------

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
