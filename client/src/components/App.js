import React from "react";
import {Global, css} from "@emotion/core";
import {Route, Switch} from "react-router-dom";
import StudentCreatePlan from "./create_plan/StudentCreatePlan";
import ViewPlan from "./view_plan/ViewPlan";
import PageInternalError from "./general/PageInternalError";
import PageNotFound from "./general/PageNotFound";
import StudentHome from "./StudentHome";
import AdvisorHome from "./AdvisorHome";

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
      <Switch>
        <Route exact path="/">
          <StudentHome userId={1}/>
        </Route>
        <Route path="/advisorHome">
          <AdvisorHome />
        </Route>
        <Route path="/createPlan">
          <StudentCreatePlan />
        </Route>
        <Route path="/viewPlan/:planId">
          <ViewPlan />
        </Route>
        <Route path="/editPlan/:planId">
          <StudentCreatePlan />
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