interface Coord {
  x: number;
  y: number;
}

/**
 * Performs a coordinate transformation the same as CSS "contain".
 *
 * This is used to transform between browser coords to video coords.
 */
export default class ContainTransform {
  private readonly scale = Math.min(
    this.dest.x / this.src.x,
    this.dest.y / this.src.y,
  );

  private deltaX =
    Math.max(0, this.dest.x - (this.dest.y / this.src.y) * this.src.x) / 2;
  private deltaY =
    Math.max(0, this.dest.y - (this.dest.x / this.src.x) * this.src.y) / 2;

  constructor(private readonly src: Coord, private readonly dest: Coord) {}

  inverse({ x, y }: Coord) {
    return {
      x: (x - this.deltaX) / this.scale,
      y: (y - this.deltaY) / this.scale,
    };
  }
}
