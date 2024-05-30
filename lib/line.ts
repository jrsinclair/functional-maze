import { Point } from './point';

class Line {
    readonly a: Point;
    readonly b: Point;
    constructor(a: Point, b: Point) {
        this.a = a;
        this.b = b;
    }

    toString() {
        return `${this.a}-${this.b}`;
    }
}

export type { Line };

const allLines = new Map<string, Line>();

export const line = (a: Point, b: Point) => {
    const str = a.lte(b) ? `${a}-${b}` : `${b}-${a}`;
    if (allLines.has(str)) return allLines.get(str)!;
    const newLine = a.lte(b) ? new Line(a, b) : new Line(b, a);
    Object.freeze(newLine);
    allLines.set(str, newLine);
    return newLine;
};
