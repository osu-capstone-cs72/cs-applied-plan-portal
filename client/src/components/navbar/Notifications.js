/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {getToken} from "../../utils/authService";
import { patch } from "needle";

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
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;
      margin-right: 0.5rem;
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
      background-color: black;
      color: white;
    }
  `;

  // when the page first loads, show the list of unseen notifications
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
        setNotifications(...notifications);
      }

    } catch (err) {
      // log server error, if it happens while fetching notifications
      console.log("An internal server error occurred. Please try again later.");
    }

    // after the notifications are returned or fail set a timer to try again
    setTimeout(fetchNotifications, TIME_BETWEEN_NOTIFICATIONS);

  }

  // clear a specific notification
  async function clearNotification(notificationId, index) {

    try {

      // set the notification to checked
      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/notification/${notificationId}` +
        `?accessToken=${token}`;
      await fetch(url, {
        method: "PATCH"
      });

      // delete the notification on the client-side
      const newNotifications = notifications.slice();
      newNotifications.splice(index, 1);
      console.log("newNotifications:", newNotifications, "\nnotifications:", notifications);
      setNotifications(newNotifications);

    } catch (err) {
      // log server error, if it happens while fetching notifications
      console.log("An internal server error occurred. Please try again later.");
    }

  }

  // handle clicking on a notification
  function handleClick(event, item, index) {

    // only link to another page if the notification is
    // intended to be used as a link
    if (!item.planId) {
      event.preventDefault();
    }

    // remove the notification from the drop down
    // menu of unseen notifications
    clearNotification(item.notificationId, index);

  }

  return (
    <div className="notification-dropdown" css={style}>
      <button className="drop-button">Notifications
        <i className="fa fa-caret-down" />
      </button>
      {notifications.length ?
        <span className="badge">{notifications.length}</span> : null }
      <div className="dropdown-content">
        {notifications.length ? (
          notifications.map((item, index) => (
            <Link key={item.notificationId} to={`/viewPlan/${item.planId}`}
              onClick={(event) => handleClick(event, item, index)}>
              {item.text}
            </Link>
          ))
        ) : (
          <Link to={`.`} onClick={(event) => event.preventDefault()}>
            <p>No new notifications.</p>
          </Link>
        )}
      </div>
    </div>
  );

}
export default withRouter(Notifications);