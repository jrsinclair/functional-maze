import { Set, List } from 'immutable';
import { line, type Line } from './line';
import { p, type Point, addPoint, NORTH, SOUTH, EAST, WEST } from './point';
import { randomInRange } from './util';

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
};

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
