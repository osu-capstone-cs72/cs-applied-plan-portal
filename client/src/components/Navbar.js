/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {logout} from "../utils/authService";
import {withRouter} from "react-router-dom";
import {getToken} from "../utils/authService";

function Navbar(props) {

  const [notifications, setNotifications] = useState([]);

  const style = css`

    display: flex;
    position: absolute;
    width: 100%;
    height: 35px;
    background-color: orange;

    #navbar-search {
      width: 35%;
    }

    .osu-logo {
      vertical-align: middle;
    }

    .right-container {
      margin-left: auto;
    }

    .dropdown {
      display: inline-block;
    }

    .dropdown .dropbtn, .logout {
      height: 35px;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    .dropdown-content a {
      float: none;
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
    }

    .dropdown-content a:hover {
      background-color: #ddd;
    }

    .dropdown:hover .dropdown-content {
      display: block;
    }

    .badge {
      position: absolute;
      top: 5px;
      right: 10px;
      padding: 5px 10px;
      border-radius: 50%;
      background-color: red;
      color: white;
    }
  `;

  useEffect(() => {
    async function fetchData() {

      try {

        const token = getToken();
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const url = `http://${server}/notification` +
          `?accessToken=${token}`;
        let obj = [];

        // get notifications data
        const response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setNotifications(obj.notifications);
        }

      } catch (err) {
        // log server error, if it happens while fetching notifications
        console.log("An internal server error occurred. Please try again later.");
      }

    }

    fetchData();

  }, []);

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
        <div className="dropdown">
          <button className="dropbtn">Notifications
            <i className="fa fa-caret-down"></i>
          </button>
          {notifications.length ?
            <span className="badge">{notifications.length}</span> : null }
          <div className="dropdown-content">
            {notifications.map((item) => (
              <Link key={item.notificationId} to={`/viewPlan/${item.planId}`}>
                {item.text}
              </Link>
            ))}
          </div>
        </div>
        {props.showSearch ? <input id="navbar-search" className="form-control mr-sm-2" type="text" placeholder={props.searchContent} name="search"/> : null}
        <button className="logout" onClick={() => logoutUser()}>Log out</button>
      </div>
    </div>
  );

}
export default withRouter(Navbar);

Navbar.propTypes = {
  history: PropTypes.object,
  showSearch: PropTypes.bool,
  searchContent: PropTypes.string
};