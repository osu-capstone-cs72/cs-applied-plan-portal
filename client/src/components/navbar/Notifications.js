/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {getToken} from "../../utils/authService";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const TIME_BETWEEN_NOTIFICATIONS = 5000;

  const style = css`

    & {
      display: inline-block;
      height: 35px;
    }

    &:hover .dropdown-content {
      display: block;
    }

    .drop-button {
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

    .badge {
      position: absolute;
      top: 5px;
      right: 80px;
      padding: 5px 10px;
      border-radius: 50%;
      background-color: red;
      color: white;
    }
  `;

  useEffect(() => {

    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  // get all notifications for the current user
  async function fetchNotifications() {

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
      } else {
        setNotifications([]);
      }

    } catch (err) {
      // log server error, if it happens while fetching notifications
      console.log("An internal server error occurred. Please try again later.");
    }

    // after the notifications are returned or fail set a timer to try again
    setTimeout(fetchNotifications, TIME_BETWEEN_NOTIFICATIONS);

  }

  return (
    <div className="notification-dropdown" css={style}>
      <button className="drop-button">Notifications
        <i className="fa fa-caret-down" />
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
  );

}
export default withRouter(Notifications);

Notifications.propTypes = {
  history: PropTypes.object,
};