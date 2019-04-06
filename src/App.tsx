import { useState } from "react";
import Intro from "./Intro";
import { jsx } from "@emotion/core";
import SetupInstructions from "./SetupInstructions";
import CalibrateScreen from "./CalibrateScreen";

type Mode = "intro" | "setup-instructions" | "calibrate-screen";

export default function App() {
  const [mode, setMode] = useState<Mode>("intro");

  switch (mode) {
    case "intro":
      return <Intro start={() => setMode("setup-instructions")} />;
    case "setup-instructions":
      return <SetupInstructions continue={() => setMode("calibrate-screen")} />;
    case "calibrate-screen":
      return <CalibrateScreen />;
  }
}
