import { Set, List } from 'immutable';
import { line, type Line } from './line';
import { p, type Point, addPoint, NORTH, SOUTH, EAST, WEST } from './point';
import { randomInRange, randomInt, range, shuffle } from './util';

//
// Maze building functions
// ------------------------------------------------------------------------------------------------

function initialState(n: number) {
    // Create each individual outer all.
    const northWall = new Array(n - 1).fill(undefined).map((_, x) => line(p(x, 0), p(x + 1, 0)));
    const southWall = new Array(n - 1)
        .fill(undefined)
        .map((_, x) => line(p(x, n - 1), p(x + 1, n - 1)));
    const westWall = new Array(n - 2).fill(undefined).map((_, y) => line(p(0, y + 1), p(0, y + 2)));
    const eastWall = new Array(n - 2)
        .fill(undefined)
        .map((_, y) => line(p(n - 1, y), p(n - 1, y + 1)));

    // Combine individual walls into a single set of Line objects.
    const outerWalls = Set([...northWall, ...southWall, ...westWall, ...eastWall]);

    // Add all the points so far into a List. We add them to a Set first to prevent duplicates.
    // Then we convert it to a list so we can randomly select an item by its index.
    const initalBranchPoints = Set([...outerWalls.flatMap(({ a, b }) => [a, b])]).toList();

    // Add the remaining unconnected Points to a set.
    const unconnected = Set(
        new Array(n * n)
            .fill(undefined)
            .map((_, i) => p(i % n, Math.floor(i / n)))
            .filter((pt) => !initalBranchPoints.includes(pt)),
    );

    // Return our initial state.
    return { outerWalls, initalBranchPoints, unconnected };
}

function getCandidates(branchPoint: Point, unconnected: Set<Point>) {
    return [NORTH, SOUTH, EAST, WEST]
        .map(addPoint(branchPoint))
        .filter((pt) => unconnected.has(pt));
}

/**
 * Get unconnected adjacent rooms.
 *
 * @param {Point} room The room to find unconnected
 *     adjacent rooms for.
 * @param {Set<Point>} unconnected The set of
 *     remaining unconnected rooms.
 * @returns {Point[]} An array of up to 4 points,
 *     representing adjacent rooms we might connect
 *     this point to.
 */
function getUnconnectedAdjacentRooms(room: Point, unconnected: Set<Point>): Point[] {
    return [NORTH, SOUTH, EAST, WEST].map(addPoint(room)).filter(unconnected.has.bind(unconnected));
}

function buildMaze(
    lines: Set<Line>,
    branchPoints: List<Point>,
    unconnected: Set<Point>,
    seed: number,
) {
    if (unconnected.size === 0) return lines;
    if (branchPoints.size === 0) {
        const n = lines.filter(({ a, b }) => a.y && b.y === 0).size;
        throw new Error(
            'Ran out of branch points before unconnected points. This should not happen. Maze so far:\n' +
                renderMazeText(n, lines),
        );
    }
    const [nextSeed01, bpIdx] = randomInRange(seed, branchPoints.size);
    const branchPoint = branchPoints.get(bpIdx)!;
    const candidates = getCandidates(branchPoint, unconnected);
    if (candidates.length == 0) {
        return buildMaze(lines, branchPoints.delete(bpIdx), unconnected, nextSeed01);
    }
    const [nextSeed02, candidateIdx] = randomInRange(nextSeed01, candidates.length);
    if (!candidates[candidateIdx]) {
        console.log(`Index ${candidateIdx} of`, candidates, 'does not exist');
    }
    const newLines = lines.add(line(branchPoint, candidates[candidateIdx]));
    const newBranchPoints =
        candidates.length == 1
            ? branchPoints.push(candidates[candidateIdx]).delete(bpIdx)
            : branchPoints.push(candidates[candidateIdx]);
    const newUnconnected = unconnected.delete(candidates[candidateIdx]);
    return buildMaze(newLines, newBranchPoints, newUnconnected, nextSeed02);
}

export function maze(n: number, seed = Date.now()) {
    const { outerWalls, initalBranchPoints, unconnected } = initialState(n);
    return buildMaze(outerWalls, initalBranchPoints, unconnected, seed);
}

// Alternate maze algorithm
// ------------------------------------------------------------------------------------------------

/**
 * Build initial state.
 *
 * Create an n ⨉ n grid, represented as a set of
 * point objects.
 *
 * @param {number} seed A random number seed.
 * @param {number} n The size of the maze to build.
 * @returns {[Set<Point>, Set<Line>, Point, number]} An empty set of
 *     lines, and a grid of points.
 */
function buildInitialState(seed: number, n: number): [Set<Point>, Set<Line>, Point, number] {
    // Build the grid by flat-mapping a range over
    // a range.
    const rooms = range(n).flatMap((y) => range(n).map((x) => p(x, y)));

    // Create the empty set of lines to represent
    // connected rooms.
    const connectedRooms = Set<Line>();

    // Pick a random room in the grid to be our
    // starting point.
    const [nextSeed1, x] = randomInRange(seed, n);
    const [nextSeed2, y] = randomInRange(nextSeed1, n);
    const startPoint = p(x, y);

    return [Set(rooms), connectedRooms, startPoint, nextSeed2];
}

/**
 * Build a maze.
 *
 * @param {Set<Point>} uconnectedRooms Rooms in the
 *     grid that we haven't connected yet.
 * @param {Set<Line>} connectedRooms Rooms that we've
 *     connected to the maze.
 * @param {Point} currentRoom The room we're going to
 *     branch from.
 * @param {number} seed A random number seed.
 * @returns {[Set<Point>, Set<Line>, number]} Returns
 *     a tuple containing:
 *     - A new set of unconnected rooms.
 *     - A new set of connected rooms.
 *     - A new random number seed.
 */
function buildMazeImproved(
    unconnectedRooms: Set<Point>,
    connectedRooms: Set<Line>,
    currentRoom: Point,
    seed: number,
): [Set<Point>, Set<Line>, number] {
    // Check to see how many rooms remain unconnected.
    // If there are no more unconnected rooms,
    // we've finished.
    if (unconnectedRooms.size === 0) {
        return [unconnectedRooms.remove(currentRoom), connectedRooms, seed];
    }

    // Make a list of adjacent rooms that are not yet
    // connected to any other rooms.
    const candidates = getUnconnectedAdjacentRooms(currentRoom, unconnectedRooms);

    // If there are no unconnected adjacent rooms, go
    // back one room.
    if (candidates.length === 0) {
        return [unconnectedRooms.remove(currentRoom), connectedRooms, seed];
    }

    // Pick one of the unconnected adjacent rooms at
    // random and connect it with this room.
    const [nextSeed1, idx] = randomInRange(seed, candidates.length);
    const updatedMaze = connectedRooms.add(line(currentRoom, candidates[idx]));
    const updatedUnconnected = unconnectedRooms.remove(currentRoom);

    // Move to the newly connected room.
    const [nextUnconnected, nextMaze, nextSeed2] = buildMazeImproved(
        updatedUnconnected,
        updatedMaze,
        candidates[idx],
        nextSeed1,
    );

    // There may still be other directions we can
    // connect to this room, so we call buildMaze()
    // again to repeat.
    return buildMazeImproved(nextUnconnected, nextMaze, currentRoom, nextSeed2);
}

function graphToWalls(n: number, graph: Set<Line>) {
    const northWall = range(n).map((x) => line(p(x, 0), p(x + 1, 0)));
    const westWall = range(n).map((y) => line(p(0, y), p(0, y + 1)));
    const southWall = range(n).map((x) => line(p(x, n), p(x + 1, n)));
    const eastWall = range(n).map((y) => line(p(n, y), p(n, y + 1)));
    const allPossibleWalls = Set([
        ...northWall,
        ...westWall,
        ...southWall,
        ...eastWall,
        ...range(n).flatMap((y) =>
            range(n).flatMap((x) => [line(p(x, y), p(x + 1, y)), line(p(x, y), p(x, y + 1))]),
        ),
    ]);
    return graph.reduce(
        (walls, ab) => walls.remove(line(ab.b, p(ab.a.x + 1, ab.a.y + 1))),
        allPossibleWalls,
    );
}

/**
 * Maze.
 *
 * Build a square maze, given a random seed and an
 * positive integer to describe how large it
 * should be.
 *
 * @param {number} seed A number to seed the
 *   pseudorandom number generator.
 * @param {number} n A positive integer defining how
 *   large our square maze should be.
 * @returns {Set<Line>} A set of connected rooms,
 *   represented as lines.
 */
export function mazeImproved(seed: number, n: number): Set<Line> {
    // Set up the initial state.
    const [grid, emptySet, startPoint, newSeed] = buildInitialState(seed, n);

    // Run the recursive algorithm.
    const [_, finalMaze] = buildMazeImproved(grid, emptySet, startPoint, newSeed);

    return graphToWalls(n, finalMaze);
}

//
// Rendering functions
// ------------------------------------------------------------------------------------------------

export function renderMazeAscii(n: number, lines: Set<Line>): string {
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

const xyToChar = (x: number, y: number, lines: Set<Line>) => {
    const pt = p(x, y);
    const idx = [
        ['N' as const, NORTH] as const,
        ['E' as const, EAST] as const,
        ['S' as const, SOUTH] as const,
        ['W' as const, WEST] as const,
    ]
        .map(([c, dir]) => [c, line(pt, addPoint(pt)(dir))] as const)
        .filter(([, line]) => lines.has(line))
        .map(([c]) => c)
        .join('') as keyof typeof RENDER_MAP;
    return RENDER_MAP[idx];
};

export function renderMazeText(n: number, lines: Set<Line>): string {
    return new Array(n)
        .fill(undefined)
        .map(() => new Array(n).fill(' '))
        .map((row, y) => row.map((_, x) => xyToChar(x, y, lines)).join(''))
        .join('\n');
}

export function renderMazeSVG(n: number, squareSize: number, lines: Set<Line>): string {
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
