import { useState, useEffect, useRef } from "react";
import { jsx } from "@emotion/core";

type ScreenCorner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

const corners: ScreenCorner[] = [
  "topLeft",
  "topRight",
  "bottomRight",
  "bottomLeft",
];

const getCornerCss = (corner: ScreenCorner) => {
  switch (corner) {
    case "topLeft":
      return {
        top: 0,
        left: 0,
      };
    case "topRight":
      return {
        top: 0,
        left: "100vw",
      };
    case "bottomRight":
      return {
        top: "100vh",
        left: "100vw",
      };
    case "bottomLeft":
      return {
        top: "100vh",
        left: 0,
      };
  }
};

export default function CalibrateScreen() {
  const [corner, setCorner] = useState(corners[0]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      const media = await navigator.mediaDevices.getUserMedia({ video: true });

      const { width, height } = media.getVideoTracks()[0].getSettings();

      console.log(width, height);

      videoRef.current!.srcObject = media;
    })();
  }, []);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    console.log(event.clientX, event.clientY);

    setCorner(
      prevCorner => corners[(corners.indexOf(prevCorner) + 1) % corners.length],
    );
  };

  return (
    <main
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        css={{
          position: "fixed",
          width: 100,
          height: 100,
          transform: "translate(-50%, -50%)",
          color: "red",
          borderRadius: "100%",
          backgroundColor: "red",
          ...getCornerCss(corner),
        }}
      />

      <p>Click the highlighed corners in the video below</p>

      <video
        css={{ width: "calc(100vw - 100px)" }}
        autoPlay
        ref={videoRef}
        onClick={handleVideoClick}
      />
    </main>
  );
}
