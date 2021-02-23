/** @jsx jsx */
import React from "react";

import {useState, useEffect} from "react";
import {jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import Cookies from "js-cookie";
import NotificationHeadAdv from "../head_advisor_nav/notifications/NotificationHeadAdv";
import NotificationCommon from "./NotificationCommon";



// dropdown menu that shows notifications
function Notifications() {

  const [role, setRole] = useState(-1);
  const [notifications, setNotifications] = useState([]);
  const TIME_BETWEEN_NOTIFICATIONS = 5000;

  useEffect(() => {
    const role = Cookies.get("role");
    setRole(role);
  }, []);

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

      // delete the notification
      const url = `/api/notification/${notificationId}`;
      await fetch(url, {
        method: "DELETE"
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
    <React.Fragment>
      {role === "2" && <NotificationHeadAdv
        notifications={notifications}
        handleClick={handleClick}
      />}
      {role !== "2" && <NotificationCommon
        notifications={notifications}
        handleClick={handleClick} />}
    </React.Fragment>
  );

}
export default withRouter(Notifications);