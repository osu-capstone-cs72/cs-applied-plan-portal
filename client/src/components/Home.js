/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import StudentHome from "./student_home/StudentHome";
import AdvisorHome from "./advisor_home/AdvisorHome";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import {loggedIn, getProfile} from "../utils/authService";

function Home(props) {

  const [loading] = useState(true);
  const [pageState, setPageState] = useState(0);

  const style = css`
  `;

  useEffect(() => {
    async function checkLoggedIn () {

      // check to see if the user is logged in
      const validToken = loggedIn();

      if (validToken) {

        // render a page based on the users role
        const profile = await getProfile();
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
      <div id="home-container" css={style}>
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
