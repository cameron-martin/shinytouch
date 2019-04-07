import { useState } from "react";
import Intro from "./Intro";
import { jsx } from "@emotion/core";
import Setup from "./Setup";
import { hot } from "react-hot-loader";

type Mode = "intro" | "setup";

function App() {
  const [mode, setMode] = useState<Mode>("intro");

  switch (mode) {
    case "intro":
      return <Intro start={() => setMode("setup")} />;
    case "setup":
      return <Setup />;
  }
}

export default hot(module)(App);
