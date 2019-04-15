import { useState, useEffect, useRef } from "react";
import { jsx, css } from "@emotion/core";
import ContainTransform from "../ContainTransform";
import cv from "../opencv";
import { highConstrast, layer } from "../mixins";
import React from "react";
import ApiClient from "../ApiClient";
import uuid from "uuid/v4";

interface Coord {
  x: number;
  y: number;
}

interface Example {
  videoCoord: Coord;
  screenCoord: Coord;
}

type Mode = { step: 1 } | { step: 2 };

interface Props {
  mediaStream: MediaStream;
  video: React.RefObject<HTMLVideoElement>;
}

const CALIBRATION_EXAMPLES = 8;

function captureFrame(
  video: HTMLVideoElement,
  type?: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas
      .getContext("2d")!
      .drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toBlob(
      blob => {
        if (blob == null) {
          reject(new Error("Could not convert canvas to blob"));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export default function Calibration(props: Props) {
  const [crossPosition, setCrossPosition] = useState<Coord | null>(null);
  const [mode, setMode] = useState<Mode>({ step: 1 });
  const sessionId = useRef(uuid());

  const setRandomCrossPosition = () =>
    setCrossPosition({ x: Math.random(), y: Math.random() });

  useEffect(() => {
    setRandomCrossPosition();
  }, []);

  const calibrationExamples = useRef<Example[]>([]);

  const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
    const video = props.video.current!;

    const videoCoord = new ContainTransform(
      { width: video.videoWidth, height: video.videoHeight },
      { width: video.clientWidth, height: video.clientHeight },
    ).inverse({ x: event.clientX, y: event.clientY });

    const example: Example = {
      videoCoord: videoCoord,
      screenCoord: {
        x: crossPosition!.x * window.innerWidth,
        y: crossPosition!.y * window.innerHeight,
      },
    };

    calibrationExamples.current.push(example);

    captureFrame(video, "image/jpeg", 0.98).then(frame => {
      new ApiClient().addExample(sessionId.current, frame);
    });

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
      examples.flatMap(({ videoCoord: coord }) => [coord.x, coord.y]),
    );

    let dstTri = cv.matFromArray(
      examples.length,
      1,
      cv.CV_32FC2,
      examples.flatMap(({ screenCoord: coord }) => [coord.x, coord.y]),
    );

    const transform = cv.findHomography(srcTri, dstTri, cv.LMEDS);

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
