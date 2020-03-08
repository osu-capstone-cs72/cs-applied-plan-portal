/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {logout} from "../../utils/authService";
import {withRouter} from "react-router-dom";
import Notifications from "./Notifications";
import History from "./History";
import {getProfile} from "../../utils/authService";
import {useEffect, useState} from "react";

function Navbar(props) {

  // role and function to set role, default to 0 (Student)
  const [role, setRole] = useState(0);

  useEffect(() => {
    async function checkRole() {
      const profile = await getProfile();
      if (!profile.role) {
        setRole(0);
      } else {
        setRole(profile.role);
      }
    }
    checkRole();
  }, []);

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

    .logout {
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
        {role ? <History /> : null}
        <Notifications />
        <button className="logout" onClick={() => logoutUser()}>Log out</button>
      </div>
    </div>
  );

}
export default withRouter(Navbar);

Navbar.propTypes = {
  history: PropTypes.object
};
