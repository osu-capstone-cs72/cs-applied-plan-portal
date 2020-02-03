import React from "react";
import {Route, Switch} from "react-router-dom";
import StudentCreatePlan from "./StudentCreatePlan";
import List from "./List";
import Home from "./Home";

// <StudentCreatePlan />
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/list">
          <List />
        </Route>
      </Switch>

    </div>
  );
}

export default App;