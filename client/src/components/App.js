import React from "react";
import {Global, css} from "@emotion/core";
import {Route, Switch} from "react-router-dom";
import StudentCreatePlan from "./create_plan/StudentCreatePlan";
import ViewPlan from "./view_plan/ViewPlan";
import PageInternalError from "./general/PageInternalError";
import PageNotFound from "./general/PageNotFound";
import Home from "./Home";
import Login from "./Login";
import SetRoles from "./set_roles/SetRoles";

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css?family=Muli');
  body {
    font-family: 'Muli', sans-serif;
    margin: 0;
    background: var(--color-lightgray-200);
  }
  
  :root {
    --color-orange-50:  #FFF5F2;
    --color-orange-100: #FEDCD2;
    --color-orange-200: #FEC4B2;
    --color-orange-300: #F99473;
    --color-orange-400: #F26D41;
    --color-orange-500: #E7501C;
    --color-orange-600: #D73F09;
    --color-orange-700: #C03505;
    --color-orange-800: #A42A02;
    --color-orange-900: #872000;
    
    --color-lightgray-50:  #FDFDFF;
    --color-lightgray-100: #F8F9FE;
    --color-lightgray-200: #F2F4FB;
    --color-lightgray-300: #EAEDF7;
    --color-lightgray-400: #E0E4EF;
    --color-lightgray-500: #D2D8E4;
    --color-lightgray-600: #C2C9D5;
    --color-lightgray-700: #AFB7C3;
    --color-lightgray-800: #A4AEBA;
    --color-lightgray-900: #9AA5B1;
    
    --color-gray-50:    #F5F7FA;
    --color-gray-100:   #E4E7EB;
    --color-gray-200:   #CBD2D9;
    --color-gray-300:   #9AA5B1;
    --color-gray-400:   #7B8794;
    --color-gray-500:   #616E7C;
    --color-gray-600:   #52606D;
    --color-gray-700:   #3E4C59;
    --color-gray-800:   #323F4B;
    --color-gray-900:   #1F2933;
    
    --color-red-50:     #FFEEEE;
    --color-red-100:    #FACDCD;
    --color-red-200:    #F29B9B;
    --color-red-300:    #E66A6A;
    --color-red-400:    #D64545;
    --color-red-500:    #BA2525;
    --color-red-600:    #A61B1B;
    --color-red-700:    #911111;
    --color-red-800:    #780A0A;
    --color-red-900:    #610404;

    --color-yellow-50:  #FFFAEB;
    --color-yellow-100: #FCEFC7;
    --color-yellow-200: #F8E3A3;
    --color-yellow-300: #F9DA8B;
    --color-yellow-400: #F7D070;
    --color-yellow-500: #E9B949;
    --color-yellow-600: #C99A2E;
    --color-yellow-700: #A27C1A;
    --color-yellow-800: #7C5E10;
    --color-yellow-900: #513C06;

    --color-green-50:   #E3F9E5;
    --color-green-100:  #C1EAC5;
    --color-green-200:  #A3D9A5;
    --color-green-300:  #7BC47F;
    --color-green-400:  #57AE5B;
    --color-green-500:  #3F9142;
    --color-green-600:  #2F8132;
    --color-green-700:  #207227;
    --color-green-800:  #0E5814;
    --color-green-900:  #05400A;

    --color-blue-50:    #EBF8FF;
    --color-blue-100:   #D1EEFC;
    --color-blue-200:   #A7D8F0;
    --color-blue-300:   #7CC1E4;
    --color-blue-400:   #55AAD4;
    --color-blue-500:   #3994C1;
    --color-blue-600:   #2D83AE;
    --color-blue-700:   #1D6F98;
    --color-blue-800:   #166086;
    --color-blue-900:   #0B4F71;
  }
`;

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
        <Route path="/createPlan">
          <StudentCreatePlan />
        </Route>
        <Route path="/viewPlan/:planId">
          <ViewPlan />
        </Route>
        <Route path="/editPlan/:planId">
          <StudentCreatePlan />
        </Route>
        <Route path="/manageRoles">
          <SetRoles />
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