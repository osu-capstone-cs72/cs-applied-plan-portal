/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import Notifications from "./Notifications";
import History from "./History";
import Logout from "./Logout";
import {getProfile} from "../../utils/authService";
import {useEffect, useState} from "react";

function Navbar() {

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
    
    & a:first-child:hover {
      text-decoration: none;
    }
    
    & a:first-child {
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

    .right-container {
      margin-left: auto;
    }

    .logout {
      height: 35px;
    }

    @media print {
      & {
        display: none;
      }
    }

  `;

  return (
    <div className="navbar-parent" css={style}>
      <Link to={"/"}>
        <p className="osu-logo">OSU CS Applied Plan Portal</p>
      </Link>
      <div className="right-container">
        {role ? <History /> : null}
        <Notifications />
        <Logout />
      </div>
    </div>
  );

}
export default withRouter(Navbar);
