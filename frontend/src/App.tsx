import { useState } from "react";
import Intro from "./Intro";
import { jsx } from "@emotion/core";
import { hot } from "react-hot-loader";
import Setup from "./Setup";

type Step =
  | { type: "intro" }
  | {
      type: "setup";
      mediaStream: MediaStream;
    };

function App() {
  const [step, setStep] = useState<Step>({ type: "intro" });

  const start = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080, frameRate: 60 },
    });

    setStep({ type: "setup", mediaStream });
  };

  switch (step.type) {
    case "intro":
      return <Intro start={start} />;
    case "setup":
      return <Setup mediaStream={step.mediaStream} />;
  }
}

export default hot(module)(App);
