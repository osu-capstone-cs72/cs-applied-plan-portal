import React from "react";
import {Route, Switch} from "react-router-dom";
import StudentCreatePlan from "./StudentCreatePlan";
import ViewPlan from "./ViewPlan";
import PageInternalError from "./PageInternalError";
import PageNotFound from "./PageNotFound";
import Home from "./Home";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/createPlan">
          <StudentCreatePlan />
        </Route>
        <Route path="/viewPlan">
          <ViewPlan />
        </Route>
        <Route path="/500">
          <PageInternalError />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>

    </div>
  );
}

export default App;