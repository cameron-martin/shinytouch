import { jsx } from "@emotion/core";
import Unspammable from "./Unspammable";

interface Props {
  start(): Promise<void>;
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
      <Unspammable onClick={props.start}>
        {({ onClick, isLoading }) => (
          <button onClick={onClick} disabled={isLoading}>
            {isLoading ? "Starting..." : "Start ➡"}
          </button>
        )}
      </Unspammable>
    </main>
  );
}
