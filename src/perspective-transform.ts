import math from "mathjs";

export interface Coord {
  x: number;
  y: number;
}

export interface CoordPair {
  from: Coord;
  to: Coord;
}

/**
 * Uses this: http://web.archive.org/web/20120517010151/http://xenia.media.mit.edu/~cwren/interpolator/
 */
export default class PerspectiveTransform {
  static fromExamples(examples: CoordPair[]) {
    const A = examples.flatMap(({ from, to }) => [
      [to.x, to.y, 1, 0, 0, 0, -from.x * to.x, -from.x * to.y],
      [0, 0, 0, to.x, to.y, 1, -from.y * to.x, -from.y * to.y],
    ]);

    const B = examples.flatMap(({ from }) => [from.x, from.y]);

    const ATranspose = math.transpose(A);

    const result = math.multiply(
      math.multiply(math.inv(math.multiply(ATranspose, A)), ATranspose),
      B,
    );

    return new PerspectiveTransform(result as number[]);
  }

  private constructor(private readonly coeffs: number[]) {}

  forward({ x, y }: Coord): Coord {
    const [a, b, c, d, e, f, g, h] = this.coeffs;

    const divisor = g * x + h * y + 1;

    return {
      x: (a * x + b * y + c) / divisor,
      y: (d * x + e * y + f) / divisor,
    };
  }
}
