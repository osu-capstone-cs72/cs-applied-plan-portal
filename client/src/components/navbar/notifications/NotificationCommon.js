/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import Badge from "./Badge";
import {PropTypes} from "prop-types";
import {Desktop, Mobile} from "../../../utils/responsiveUI";
import {Link} from "react-router-dom";

function NotificationCommon({notifications, handleClick}) {
  const responseSize = "max-width: 860px";

  const style = css`
   & {
     display: inline-block;
     height: 35px;
   }

   button:hover {
     background: rgba(0, 0, 0, 0.15);
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

   button.drop-button-notification {
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
     box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
     z-index: 1;
     @media (${responseSize}) {
       right: 60px;
     }
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

  return (
    <div className="notification-dropdown" css={style}>
      <button
        className="drop-button-notification"
        data-count={notifications.length}
      >
        <span>
          <Desktop>Notification</Desktop>
          <Mobile>
            <i className="fas fa-bell fa-xs"></i>
          </Mobile>
        </span>
        <Badge list={notifications} />
      </button>
      <div className="dropdown-content">
        {notifications.length ? (
          notifications.map((item, index) => (
            <Link
              key={item.notificationId}
              to={`/viewPlan/${item.planId}`}
              onClick={(event) => handleClick(event, item, index)}
            >
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

export default NotificationCommon;

NotificationCommon.propTypes = {
  notifications: PropTypes.array,
  handleClick: PropTypes.func
};