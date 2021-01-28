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
import logo from "./../../images/logo.png";

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

  const responSize = "max-width: 860px";

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
      @media (${responSize}){
        height: 75px;
      }
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
      @media (${responSize}){
        width: 119px;
        height: 75px;
      }
    }

    .logo-img {
      display: none;
      @media (${responSize}){
        display: block;
        width: 40%;
        position: relative;
        left: 16px;
        top: 9px;
      }
    }

    .logo-text {
      display: flex;
      @media(${responSize}) {
        display: block;
        position: absolute;
        text-align:center;
        top: 12px;
        width: 90%;
        height: 75px;
        padding: 10px;
      }
    }

    .logo-text p{
      @media (${responSize}){
        margin-bottom: 0px;
      }
    }

    #logo-title{
      margin-right: 6px;
    }

    #logo-title2{
      @media (${responSize}){
        font-size: 15px;
        font-weight: 500;
      }
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
        <div className="osu-logo">
          <img className="logo-img" src={logo}/>
          <div className="logo-text">
            <p id="logo-title">OSU CS</p>
            <p id="logo-title2">Applied Plan</p>
          </div>
        </div>
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