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

export const NORTH = p(0, -1);
export const EAST = p(1, 0);
export const SOUTH = p(0, 1);
export const WEST = p(-1, 0);

export const addPoint = (a: Point) => (b: Point) => p(a.x + b.x, a.y + b.y);

export const subtractPoint = (a: Point) => (b: Point) => p(a.x - b.x, a.y - b.y);
