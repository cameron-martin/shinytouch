import ReactDOM from "react-dom";
import App from "./App";
import { jsx, Global } from "@emotion/core";
import React from "react";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <React.Fragment>
      <Global styles={{ "html, body": { margin: 0 } }} />
      <App />
    </React.Fragment>,
    document.getElementById("app")
  );
});
