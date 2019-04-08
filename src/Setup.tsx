import { useState, useEffect, useRef } from "react";
import { jsx, Interpolation, css } from "@emotion/core";
import ContainTransform from "./ContainTransform";
import cv from "./opencv";

interface Coord {
  x: number;
  y: number;
}

interface CoordPair {
  from: Coord;
  to: Coord;
}

const layer: Interpolation = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};

type Mode = { step: 1 } | { step: 2 };

export default function Setup() {
  const [crossPosition, setCrossPosition] = useState<Coord | null>(null);
  const [mode, setMode] = useState<Mode>({ step: 1 });
  const [videoSize, setVideoSize] = useState<Coord>({ x: 0, y: 0 });

  const setRandomCrossPosition = () =>
    setCrossPosition({ x: Math.random(), y: Math.random() });

  useEffect(() => {
    setRandomCrossPosition();
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);

  const calibrationExamples = useRef<CoordPair[]>([]);

  useEffect(() => {
    (async () => {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080, frameRate: 60 },
      });

      const videoSettings = media.getVideoTracks()[0].getSettings();

      setVideoSize({ x: videoSettings.width!, y: videoSettings.height! });

      videoRef.current!.srcObject = media;
    })();
  }, []);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;

    const videoCoord = new ContainTransform(
      { x: video.videoWidth, y: video.videoHeight },
      { x: video.clientWidth, y: video.clientHeight },
    ).inverse({ x: event.clientX, y: event.clientY });

    const example = {
      from: videoCoord,
      to: {
        x: crossPosition!.x * window.innerWidth,
        y: crossPosition!.y * window.innerHeight,
      },
    };

    calibrationExamples.current.push(example);

    if (mode.step === 1 && calibrationExamples.current.length >= 4) {
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

    const video = videoRef.current!;

    let srcTri = cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      calibrationExamples.current.flatMap(({ from }) => [from.x, from.y]),
    );

    let dstTri = cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      calibrationExamples.current.flatMap(({ to }) => [to.x, to.y]),
    );

    const transform = cv.getPerspectiveTransform(srcTri, dstTri);

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
    <main
      css={{
        height: "100vh",
        position: "relative",
      }}
    >
      <video
        css={layer}
        autoPlay
        ref={videoRef}
        onClick={handleVideoClick}
        width={videoSize.x}
        height={videoSize.y}
      />

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
        <p
          css={{
            color: "white",
            textAlign: "center",
            textShadow: "0px 0px 5px black",
          }}
        >
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
    </main>
  );
}
