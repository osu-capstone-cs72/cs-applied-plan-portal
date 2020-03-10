/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {formatTime} from "../../utils/formatTime";

function Comment(props) {

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    min-width: 350px;
    max-width: 33%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: white;

    .comment-user {
      font-weight: bold;
      font-size: large;
    }

    .comment-time {
      font-style: italic;
    }

    comment-text {
      font-size: large;
    }
  `;

  return (
    <div className="comment-container" css={style}>
      <p className="comment-user">{props.firstName + " " + props.lastName}</p>
      <p className="comment-time">{formatTime(props.time)}</p>
      <p className="comment-text">{props.text}</p>
    </div>
  );

}
export default Comment;

Comment.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  userId: PropTypes.number,
  time: PropTypes.string,
  text: PropTypes.string
};