import { jsx } from "@emotion/core";
import { layer } from "./mixins";
import { useRef, useEffect, useState } from "react";
import SetupInstructions from "./setup/SetupInstructions";
import Calibration from "./setup/Calibration";

interface Props {
  mediaStream: MediaStream;
}

export default function Setup(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<"instructions" | "calibration">(
    "instructions",
  );

  const videoSettings = props.mediaStream.getVideoTracks()[0].getSettings();

  useEffect(() => {
    videoRef.current!.srcObject = props.mediaStream;
  }, []);

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
        width={videoSettings.width}
        height={videoSettings.height}
      />

      {(() => {
        switch (step) {
          case "instructions":
            return (
              <SetupInstructions continue={() => setStep("calibration")} />
            );
          case "calibration":
            return (
              <Calibration video={videoRef} mediaStream={props.mediaStream} />
            );
        }
      })()}
    </main>
  );
}
