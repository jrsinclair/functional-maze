import { List, Map } from 'immutable';
import { p, type Point, addPoint, NORTH, SOUTH, EAST, WEST } from './point';
import { randomInRange } from './util';

export {
  renderMazeText,
  renderMazeAscii,
  renderMazeSVG,
  graphToWalls,
  roomsToList,
} from './render';

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
