declare namespace opencv {
  class Mat {
    constructor(rows?: number, cols?: number, type?: number);
    readonly cols: number;
    readonly rows: number;

    delete(): void;
  }

  function matFromArray(
    rows: number,
    cols: number,
    type: number,
    array: number[],
  ): Mat;

  function getPerspectiveTransform(src: Mat, dst: Mat): Mat;

  function warpPerspective(
    src: Mat,
    dst: Mat,
    M: Mat,
    dsize: Size,
    flags: number,
    borderMode: number,
    borderValue: Scalar,
  ): void;

  function imread(id: string): Mat;
  function imshow(id: string | HTMLCanvasElement, dst: Mat): void;

  class Point {
    constructor(x: number, y: number);
  }

  class Size {
    constructor(rows: number, cols: number);
  }

  class VideoCapture {
    constructor(video: HTMLVideoElement);

    read(mat: Mat): void;
  }

  class Scalar {}

  const CV_8U: number;
  const CV_8UC1: number;
  const CV_8UC2: number;
  const CV_8UC3: number;
  const CV_8UC4: number;

  const CV_8S: number;
  const CV_8SC1: number;
  const CV_8SC2: number;
  const CV_8SC3: number;
  const CV_8SC4: number;

  const CV_32FC2: number;

  const INTER_LINEAR: number;
  const BORDER_CONSTANT: number;
  const WARP_INVERSE_MAP: number;
}

export = opencv;
