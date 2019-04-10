interface Dimensions {
  width: number;
  height: number;
}

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
    this.dest.width / this.src.width,
    this.dest.height / this.src.height,
  );

  private xMargin =
    Math.max(
      0,
      this.dest.width - (this.dest.height / this.src.height) * this.src.width,
    ) / 2;
  private yMargin =
    Math.max(
      0,
      this.dest.height - (this.dest.width / this.src.width) * this.src.height,
    ) / 2;

  constructor(
    private readonly src: Dimensions,
    private readonly dest: Dimensions,
  ) {}

  inverse({ x, y }: Coord): Coord {
    return {
      x: (x - this.xMargin) / this.scale,
      y: (y - this.yMargin) / this.scale,
    };
  }
}
