/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {renderStatus} from "../../utils/renderStatus";
import {formatTime} from "../../utils/formatTime";

function Reviews(props) {

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 350px;
    max-width: 33%;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: white;

    .review-text-container {
    }

    .review-status {
      font-style: italic;
      font-size: larger;
      color: #333;
    }

    .review-time {
      font-size: small;
      color: #555;
    }

    .review-user {
      font-weight: bold;
      font-size: large;
      display: block;
    }
  `;

  if (props.commentId !== 0) {
    return (
      <div className="review-container" css={style}>
        <div className="review-text-container">
          <p><span className="review-user">{props.userName}</span><span className="review-time">{formatTime(props.time)}</span></p>
          <p className="review-status">Updated status to {renderStatus(props.status)}</p>
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