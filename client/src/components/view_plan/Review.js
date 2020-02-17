/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function Reviews(props) {

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 5px;
    width: 175px;
    height: 175px;
    border-radius: 50%;
    background-color: #b3b3b3;

    .review-text-container {
      position: relative;
      top: 30px;
    }

    .review-status-text {
      font-weight: bold;
      font-size: medium;
    }

    .review-time {
      font-style: italic;
    }

    .review-user {
      font-size: medium;
    }
  `;

  function renderStatus() {
    switch (props.status) {
      case 0:
        return "Rejected";
      case 1:
        return "Awaiting student changes";
      case 2:
        return "Awaiting review";
      case 3:
        return "Awaiting final review";
      case 4:
        return "Accepted";
      default:
        return "Undefined status";
    }
  }

  if (props.commentId !== 0) {
    return (
      <div className="review-container" css={style}>
        <div className="review-text-container">
          <p className="review-status-text">{renderStatus(props.status)}</p>
          <p className="review-user">{props.userName}</p>
          <p className="review-time">{props.time}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }

}
export default Reviews;

Reviews.propTypes = {
  userId: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  status: PropTypes.number,
  time: PropTypes.string
};