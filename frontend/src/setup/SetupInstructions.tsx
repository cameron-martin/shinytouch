import { jsx, css } from "@emotion/core";
import { highConstrast, layer } from "../mixins";

interface Props {
  continue(): void;
}

export default function SetupInstructions(props: Props) {
  return (
    <div css={css(layer, highConstrast, { textAlign: "center" })}>
      <p>
        Put your camera by the side of the screen at around a 10° angle, with
        the screen in full view.
      </p>

      <p>
        <button onClick={props.continue}>Continue ➡</button>
      </p>
    </div>
  );
}
