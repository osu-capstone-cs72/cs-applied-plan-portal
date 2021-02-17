import React from "react";
import History from "../history/History";
import Notifications from "../notifications/Notifications";
import {Link} from "react-router-dom";
import UpdateCourses from "../UpdateCourses";
import Logout from "../Logout";
import {PropTypes} from "prop-types";

function HeadAdvisorNavDesktop({currentPlan}) {
  return (
    <div>
      <History currentPlan={currentPlan} />
      <Notifications />
      <Link to={"/manageRoles"}>
        <button id="manage-roles-button">Manage Roles</button>
      </Link>
      <UpdateCourses />
      <Logout />
    </div>
  );
}

export default HeadAdvisorNavDesktop;

HeadAdvisorNavDesktop.propTypes = {
  currentPlan: PropTypes.number
};