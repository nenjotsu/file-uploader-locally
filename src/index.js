import React from "react";
import ReactDOM from "react-dom";
import Module from "./container";

import "antd/dist/antd.css";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>File Uploader Locally</h1>
      <h2>using expressjs/multer</h2>
      <Module />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
