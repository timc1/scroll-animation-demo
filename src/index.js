import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Demo from "./demo";

function App() {
  return <Demo />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
