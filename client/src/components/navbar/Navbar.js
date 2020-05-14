/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import UpdateCourses from "./UpdateCourses";
import Notifications from "./Notifications";
import History from "./History";
import Logout from "./Logout";
import {getProfile} from "../../utils/authService";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

// application navigation bar
function Navbar(props) {

  // role and function to set role, default to 0 (Student)
  const [role, setRole] = useState(0);

  // retrieve the logged in user and set role accordingly
  // if user cannot be retrieved, default to the student role
  useEffect(() => {

    async function checkRole() {
      const profile = getProfile();
      setRole(profile.role);
    }

    checkRole();

  }, []);

  const style = css`

    & {
      display: flex;
      position: absolute;
      width: 100%;
      height: 50px;
      background-color: var(--color-orange-500);
      align-items: center;
      padding: 0rem 1rem;
      grid-area: header;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9;
    }

    & a:first-of-type:hover {
      text-decoration: none;
    }

    & a:first-of-type {
      text-decoration-color: transparent !important;
    }

    .osu-logo {
      vertical-align: middle;
      font-size: large;
      font-weight: 600;
      margin: 0;
      margin-right: 1rem;
      color: white;
    }

    /* Don't style the last item, but in a way that's safe for SSR. */
    .right-container > * > button {
      height: 35px;
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;
      margin-right: 0.5rem;
    }

    .right-container {
      margin-left: auto;
    }

    #manage-roles-button:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    @media print {
      & {
        display: none;
      }
    }

  `;

  return (
    <div id="navbar" className="navbar-parent" css={style}>
      <Link to={"/"}>
        <p className="osu-logo">OSU CS Applied Plan Portal</p>
      </Link>
      <div className="right-container">
        {role ? <History currentPlan={props.currentPlan}/> : null}
        <Notifications />
        {role === 2 ? (
          <Link to={"/manageRoles"}>
            <button id="manage-roles-button">Manage Roles</button>
          </Link>
        ) : (
          null
        )}
        {role === 2 ? (
          <UpdateCourses />
        ) : (
          null
        )}
        <Logout />
      </div>
    </div>
  );

}
export default withRouter(Navbar);

Navbar.propTypes = {
  currentPlan: PropTypes.number
};