import React from "react";
import {Global, css} from "@emotion/core";
import Verifier from "./Verifier";

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css?family=Muli');
  body {
    font-family: 'Muli', sans-serif;
    margin: 0;
  }
`;

function App() {
  return (
    <div className="App">
      <Global styles={globalStyles} />
      <Verifier />
    </div>
  );
}

export default App;