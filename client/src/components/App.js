import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import StudentCreatePlan from "./create_plan/StudentCreatePlan";
import EditPlan from "./create_plan/EditPlan";
import ViewPlan from "./view_plan/ViewPlan";
import PageInternalError from "./general/PageInternalError";
import PageNotFound from "./general/PageNotFound";
import StudentHome from "./StudentHome";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <StudentHome userId={1}/>
        </Route>
        <Route path="/createPlan">
          <StudentCreatePlan />
        </Route>
        <Route path="/viewPlan/:planId">
          <ViewPlan />
        </Route>
        <Route path="/editPlan/:planId">
          <EditPlan />
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