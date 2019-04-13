import cv from ".";

// Tests for the typescript definition files

let src = cv.imread("canvasInput");
let dst = new cv.Mat();
let dsize = new cv.Size(src.rows, src.cols);
let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
  56,
  65,
  368,
  52,
  28,
  387,
  389,
  390,
]);
let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
  0,
  0,
  300,
  0,
  0,
  300,
  300,
  300,
]);
let M = cv.getPerspectiveTransform(srcTri, dstTri);
// You can try more different parameters
cv.warpPerspective(
  src,
  dst,
  M,
  dsize,
  cv.INTER_LINEAR,
  cv.BORDER_CONSTANT,
  new cv.Scalar(),
);
cv.imshow("canvasOutput", dst);
src.delete();
dst.delete();
M.delete();
srcTri.delete();
dstTri.delete();
