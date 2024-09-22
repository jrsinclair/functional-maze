import { Set } from 'immutable';
import type { Line } from './line';
import { EAST, NORTH, type Point, SOUTH, WEST, subtractPoint } from './point';

type Room = { doors: Array<Point> };
type Rooms = Room[][];

const directionToString = new Map([
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

const doorsToLinks = (x: number, y: number, doors: Array<Point>) => {
    return doors
        .map(
            (dir) =>
                `<a href="#maze-room-${x + dir.x}-${y + dir.y}">${directionToString.get(dir)}</a>`,
        )
        .join(', ');
};

export function roomsToList(rooms: Rooms) {
    return rooms.flatMap((row, y) =>
        row.map(
            ({ doors }, x) => `<li id="maze-room-${x}-${y}">
  This is room ${x},${y}. There are doors to the ${doors.join(', ').replace(/, (\w+)$/, ', and $1')}
</li>`,
        ),
    );
}
