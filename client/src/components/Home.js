/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import StudentHome from "./student_home/StudentHome";
import AdvisorHome from "./advisor_home/AdvisorHome";
import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import {getProfile} from "../utils/authService";

function Home(props) {

  const [loading] = useState(true);
  let pageState = 0;

  const style = css`
  `;

  // render a page based on the users role
  const loggedInUser = getProfile();
  if (!loggedInUser) {
    // go to the login page
    props.history.push("/login");
  } else if (loggedInUser.role > 0) {
    pageState = 2;
  } else {
    pageState = 1;
  }

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
