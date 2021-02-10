/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import StudentHome from "./student_home/StudentHome";
import AdvisorHome from "./advisor_home/AdvisorHome";
import {useEffect, useState} from "react";
import {jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import {loggedIn, getProfile} from "../utils/authService";

// renders either student or advisor homepage depending on current user
function Home(props) {
  const [loading] = useState(true);
  const [pageState, setPageState] = useState(0);

  useEffect(() => {
    async function checkLoggedIn() {
      // check to see if the user is logged in
      if (loggedIn()) {
        // render a page based on the users role
        const profile = getProfile();
        if (!profile.role) {
          setPageState(1);
        } else {
          setPageState(2);
        }
      } else {
        // go to the login page
        props.history.push("/login");
      }
    }

    checkLoggedIn();

    // eslint-disable-next-line
  }, []);

  if (!pageState) {
    return (
      <div id="home-container">
        <PageSpinner loading={loading} />
      </div>
    );
  } else if (pageState === 1) {
    return <StudentHome />;
  } else {
    return <AdvisorHome />;
  }
}
export default withRouter(Home);
