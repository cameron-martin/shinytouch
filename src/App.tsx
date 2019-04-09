import { useState } from "react";
import Intro from "./Intro";
import { jsx } from "@emotion/core";
import { hot } from "react-hot-loader";
import SetupInstructions from "./SetupInstructions";
import Calibration from "./Calibration";

type Step =
  | { type: "intro" }
  | {
      type: "setup-instructions";
      mediaStream: MediaStream;
    }
  | {
      type: "calibration";
      mediaStream: MediaStream;
    };

function App() {
  const [step, setStep] = useState<Step>({ type: "intro" });

  const start = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080, frameRate: 60 },
    });

    setStep({ type: "setup-instructions", mediaStream });
  };

  switch (step.type) {
    case "intro":
      return <Intro start={start} />;
    case "setup-instructions":
      return (
        <SetupInstructions
          continue={() =>
            setStep({
              type: "calibration",
              mediaStream: step.mediaStream,
            })
          }
        />
      );
    case "calibration":
      return <Calibration mediaStream={step.mediaStream} />;
  }
}

export default hot(module)(App);
