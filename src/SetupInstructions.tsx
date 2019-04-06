import { jsx } from "@emotion/core";

interface Props {
  continue(): void;
}

export default function SetupInstructions(props: Props) {
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
      <p>Put your camera by the side of the screen at around a 10° angle</p>

      <img
        src="https://via.placeholder.com/350x150"
        css={{ display: "block", marginBottom: "1rem" }}
      />

      <button onClick={props.continue}>Continue ➡</button>
    </main>
  );
}
