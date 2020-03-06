/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {logout} from "../../utils/authService";
import {withRouter} from "react-router-dom";
import Notifications from "./Notifications";
import History from "./History";
import {getProfile} from "../../utils/authService";

function Navbar(props) {

  const profile = getProfile();

  const style = css`

    display: flex;
    position: absolute;
    width: 100%;
    height: 35px;
    background-color: #d73f09;

    .osu-logo {
      vertical-align: middle;
      font-size: large;
      color: white;
    }

    .right-container {
      margin-left: auto;
    }

    #logout-button, #manage-roles-button {
      height: 35px;
    }

  `;

  // logout the current user
  function logoutUser() {
    logout();
    props.history.push("/login");
  }

  return (
    <div className="navbar-parent" css={style}>
      <Link to={"/"}>
        <p className="osu-logo">Oregon State University</p>
      </Link>
      <div className="right-container">
        {profile.role === 2 ? (
          <Link to={"/manageRoles"}>
            <button id="manage-roles-button">Manage Roles</button>
          </Link>
        ) : (
          null
        )}
        {profile.role ? <History /> : null}
        <Notifications />
        <button id="logout-button" onClick={() => logoutUser()}>Log out</button>
      </div>
    </div>
  );

}
export default withRouter(Navbar);

Navbar.propTypes = {
  history: PropTypes.object
};