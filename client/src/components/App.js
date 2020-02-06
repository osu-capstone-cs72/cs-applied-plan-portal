import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import StudentCreatePlan from "./StudentCreatePlan";
import ViewPlan from "./ViewPlan";
import PageInternalError from "./PageInternalError";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to="/createPlan" />
        </Route>
        <Route path="/createPlan">
          <StudentCreatePlan />
        </Route>
        <Route path="/viewPlan/:planId">
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