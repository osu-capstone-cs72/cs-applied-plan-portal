/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";

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

    .drop-button-notification {
      height: 35px;
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;
      margin-right: 0.5rem;
    }

    .badge {
      margin: 0 5px;
      background: black;
      color: white;
    }

    .drop-button-notification:before {
      position: absolute;
      top: 5px;
      right: 0px;
      padding: 5px 10px;
      border-radius: 50%;
      background-color: black;
      color: white;
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

  `;

  // fetch new notifications when the page first loads or when enough time passes
  useEffect(() => {

    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    // get all notifications for the current user
    async function fetchNotifications() {

      try {

        const url = `/api/notification`;
        let obj = [];

        // get notifications data
        const response = await fetch(url);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {

          if (response.ok) {
            obj = await response.json();
            setNotifications(obj.notifications);
          } else {
            setNotifications([]);
          }

        }

      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          // log server error, if it happens while fetching notifications
          console.log("An internal server error occurred. Please try again later.");
        }
      }

      // after the notifications are returned or fail set a timer to try again
      setTimeout(fetchNotifications, TIME_BETWEEN_NOTIFICATIONS);

    }

    fetchNotifications();

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, []);

  // clear a specific notification
  async function clearNotification(notificationId, index) {

    try {

      // set the notification to checked
      const url = `/api/notification/${notificationId}`;
      await fetch(url, {
        method: "PATCH"
      });

      // delete the notification on the client-side
      const newNotifications = notifications.slice();
      newNotifications.splice(index, 1);
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
      <button className="drop-button-notification" data-count={notifications.length}>
        Notifications
        <span className="badge" >
          {notifications.length ? notifications.length : null }
        </span>
        <i className="fa fa-caret-down" />
      </button>
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
            <p>No new notifications</p>
          </Link>
        )}
      </div>
    </div>
  );

}
export default withRouter(Notifications);