import { useState, useEffect, useRef } from "react";
import { jsx, css } from "@emotion/core";
import ContainTransform from "../ContainTransform";
import cv from "../opencv";
import { highConstrast, layer } from "../mixins";
import React from "react";

interface Coord {
  x: number;
  y: number;
}

interface CoordPair {
  from: Coord;
  to: Coord;
}

type Mode = { step: 1 } | { step: 2 };

interface Props {
  mediaStream: MediaStream;
  video: React.RefObject<HTMLVideoElement>;
}

const CALIBRATION_EXAMPLES = 8;

export default function Calibration(props: Props) {
  const [crossPosition, setCrossPosition] = useState<Coord | null>(null);
  const [mode, setMode] = useState<Mode>({ step: 1 });

  const setRandomCrossPosition = () =>
    setCrossPosition({ x: Math.random(), y: Math.random() });

  useEffect(() => {
    setRandomCrossPosition();
  }, []);

  const calibrationExamples = useRef<CoordPair[]>([]);

  const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
    const video = props.video.current!;

    const videoCoord = new ContainTransform(
      { width: video.videoWidth, height: video.videoHeight },
      { width: video.clientWidth, height: video.clientHeight },
    ).inverse({ x: event.clientX, y: event.clientY });

    const example = {
      from: videoCoord,
      to: {
        x: crossPosition!.x * window.innerWidth,
        y: crossPosition!.y * window.innerHeight,
      },
    };

    calibrationExamples.current.push(example);

    if (
      mode.step === 1 &&
      calibrationExamples.current.length >= CALIBRATION_EXAMPLES
    ) {
      setMode({
        step: 2,
      });
    }

    setRandomCrossPosition();
  };

  useEffect(() => {
    if (mode.step !== 2) {
      return;
    }

    const examples = calibrationExamples.current;
    const video = props.video.current!;

    let srcTri = cv.matFromArray(
      examples.length,
      1,
      cv.CV_32FC2,
      examples.flatMap(({ from }) => [from.x, from.y]),
    );

    let dstTri = cv.matFromArray(
      examples.length,
      1,
      cv.CV_32FC2,
      examples.flatMap(({ to }) => [to.x, to.y]),
    );

    const transform = cv.findHomography(srcTri, dstTri);

    let src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
    let dst = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let dsize = new cv.Size(window.innerWidth, window.innerHeight);
    const render = () => {
      cap.read(src);

      cv.warpPerspective(
        src,
        dst,
        transform,
        dsize,
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar(),
      );

      cv.imshow("canvas", dst);

      animationId = requestAnimationFrame(render);
    };

    let animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      // TODO: Clean up vectors, etc
    };
  }, [mode]);

  return (
    <React.Fragment>
      <div css={layer} onClick={handleVideoClick} />

      {mode.step === 2 && (
        <canvas
          css={layer}
          width={window.innerWidth}
          height={window.innerHeight}
          id="canvas"
        />
      )}

      <div
        css={css(layer, {
          pointerEvents: "none",
        })}
      >
        <p css={css(highConstrast, { textAlign: "center" })}>
          Touch the X and click where your finger is pointing in the video
        </p>

        {crossPosition && (
          <div
            css={{
              position: "absolute",
              width: 20,
              height: 20,
              transform: "translate(-50%, -50%)",
              borderRadius: "100%",
              backgroundColor: "red",
              top: `${crossPosition.y * 100}%`,
              left: `${crossPosition.x * 100}%`,
            }}
          />
        )}
      </div>
    </React.Fragment>
  );
}
