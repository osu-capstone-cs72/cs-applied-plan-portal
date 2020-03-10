/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {renderStatus} from "../../utils/renderStatus";
import {formatTime} from "../../utils/formatTime";

function Reviews(props) {

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 1rem;
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

  if (props.commentId !== 0) {
    return (
      <div className="review-container" css={style}>
        <div className="review-text-container">
          <p className="review-status-text">{renderStatus(props.status)}</p>
          <p className="review-user">{props.userName}</p>
          <p className="review-time">{formatTime(props.time)}</p>
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