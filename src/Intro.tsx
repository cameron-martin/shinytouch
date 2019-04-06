import { jsx } from "@emotion/core";

interface Props {
  start(): void;
}

export default function Intro(props: Props) {
  return (
    <main
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <h1>ShinyTouch</h1>
      <button onClick={props.start}>Start ➡</button>
    </main>
  );
}
