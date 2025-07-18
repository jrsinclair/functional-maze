class Point {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  lte(b: Point) {
    return this.y < b.y || (this.y == b.y && this.x <= b.x);
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

export type { Point };

const allPoints = new Map<string, Point>();

export const p = (x: number, y: number) => {
  const str = `${x}-${y}`;
  if (allPoints.has(str)) return allPoints.get(str)!;
  const newPoint = new Point(x, y);
  Object.freeze(newPoint);
  allPoints.set(str, newPoint);
  return newPoint;
};

export type NORTH = Point & { x: 0; y: -1 };
export type EAST = Point & { x: 1; y: 0 };
export type SOUTH = Point & { x: 0; y: 1 };
export type WEST = Point & { x: -1; y: 0 };

export const NORTH: NORTH = p(0, -1) as NORTH;
export const EAST: EAST = p(1, 0) as EAST;
export const SOUTH: SOUTH = p(0, 1) as SOUTH;
export const WEST: WEST = p(-1, 0) as WEST;

export const addPoint = (a: Point) => (b: Point) => p(a.x + b.x, a.y + b.y);

export const subtractPoint = (a: Point) => (b: Point) => p(a.x - b.x, a.y - b.y);
