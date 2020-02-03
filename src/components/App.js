import React from "react";
import {Route, Switch} from "react-router-dom";
import StudentCreatePlan from "./StudentCreatePlan";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <StudentCreatePlan />
        </Route>
      </Switch>

    </div>
  );
}

export default App;