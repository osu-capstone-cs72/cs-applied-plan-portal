import React from "react";
import { Global, css } from "@emotion/core";
import { Route, Switch } from "react-router-dom";
import StudentCreatePlan from "./create_plan/StudentCreatePlan";
import ViewPlan from "./view_plan/ViewPlan";
import PageInternalError from "./general/PageInternalError";
import PageNotFound from "./general/PageNotFound";
import Home from "./Home";
import Login from "./Login";
import ManageRoles from "./manage_roles/ManageRoles";


const globalStyles = css`
  @import url("https://fonts.googleapis.com/css?family=Muli");
  body {
    font-family: "Muli", sans-serif;
    margin: 0;
    background: #fbfaf9;
  }

  li {
    list-style: none;
  }

  select {
    background-color: white;
  }

  :root {
    --color-orange-50: #fff5f2;
    --color-orange-100: #fedcd2;
    --color-orange-200: #fec4b2;
    --color-orange-300: #f99473;
    --color-orange-400: #f26d41;
    --color-orange-500: #e7501c;
    --color-orange-600: #d73f09;
    --color-orange-700: #c03505;
    --color-orange-800: #a42a02;
    --color-orange-900: #872000;

    --color-lightgray-50: #fdfdff;
    --color-lightgray-100: #f8f9fe;
    --color-lightgray-200: #f2f4fb;
    --color-lightgray-300: #eaedf7;
    --color-lightgray-400: #e0e4ef;
    --color-lightgray-500: #d2d8e4;
    --color-lightgray-600: #c2c9d5;
    --color-lightgray-700: #afb7c3;
    --color-lightgray-800: #a4aeba;
    --color-lightgray-900: #9aa5b1;

    --color-gray-50: #f5f7fa;
    --color-gray-100: #e4e7eb;
    --color-gray-200: #cbd2d9;
    --color-gray-300: #9aa5b1;
    --color-gray-400: #7b8794;
    --color-gray-500: #616e7c;
    --color-gray-600: #52606d;
    --color-gray-700: #3e4c59;
    --color-gray-800: #323f4b;
    --color-gray-900: #1f2933;

    --color-red-50: #ffeeee;
    --color-red-100: #facdcd;
    --color-red-200: #f29b9b;
    --color-red-300: #e66a6a;
    --color-red-400: #d64545;
    --color-red-500: #ba2525;
    --color-red-600: #a61b1b;
    --color-red-700: #911111;
    --color-red-800: #780a0a;
    --color-red-900: #610404;

    --color-yellow-50: #fffaeb;
    --color-yellow-100: #fcefc7;
    --color-yellow-200: #f8e3a3;
    --color-yellow-300: #f9da8b;
    --color-yellow-400: #f7d070;
    --color-yellow-500: #e9b949;
    --color-yellow-600: #c99a2e;
    --color-yellow-700: #a27c1a;
    --color-yellow-800: #7c5e10;
    --color-yellow-900: #513c06;

    --color-green-50: #e3f9e5;
    --color-green-100: #c1eac5;
    --color-green-200: #a3d9a5;
    --color-green-300: #7bc47f;
    --color-green-400: #57ae5b;
    --color-green-500: #3f9142;
    --color-green-600: #2f8132;
    --color-green-700: #207227;
    --color-green-800: #0e5814;
    --color-green-900: #05400a;

    --color-blue-50: #ebf8ff;
    --color-blue-100: #d1eefc;
    --color-blue-200: #a7d8f0;
    --color-blue-300: #7cc1e4;
    --color-blue-400: #55aad4;
    --color-blue-500: #3994c1;
    --color-blue-600: #2d83ae;
    --color-blue-700: #1d6f98;
    --color-blue-800: #166086;
    --color-blue-900: #0b4f71;

    --color-delete: #e93b2d;
    --color-edit: #f7a000;
  }
`;

// handle all application URL page routing
function App() {
  return (
    <div className="App">
      <Global styles={globalStyles} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/createPlan/:planId">
          <StudentCreatePlan />
        </Route>
        <Route path="/viewPlan/:planId">
          <ViewPlan />
        </Route>
        <Route path="/editPlan/:planId">
          <StudentCreatePlan />
        </Route>
        <Route path="/manageRoles">
          <ManageRoles />
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
