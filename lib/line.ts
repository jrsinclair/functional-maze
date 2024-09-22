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

export const line = (a: Point, b: Point): Line => {
    if (!a.lte(b)) return line(b, a);
    const str = `${a}-${b}`;
    if (allLines.has(str)) return allLines.get(str)!;
    const newLine = new Line(a, b);
    Object.freeze(newLine);
    allLines.set(str, newLine);
    return newLine;
};
