import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import StudentCreatePlan from "./StudentCreatePlan";
import ViewPlan from "./view_plan/ViewPlan";
import PageInternalError from "./general/PageInternalError";
import PageNotFound from "./general/PageNotFound";

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