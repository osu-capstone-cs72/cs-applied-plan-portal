/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {formatTime} from "../../utils/formatTime";

// a single comment on a plan
function Comment(props) {

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    width: 33%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: white;

    .comment-user {
      font-weight: bold;
      font-size: large;
      display: block;
    }

    .comment-time {
      font-size: small;
      color: #555;
    }

    .comment-text {
      font-size: larger;
    }

    @media screen and (max-width: 800px) {
        width: 45%;
    }
    @media screen and (max-width: 600px) {
        width: 95%
    }
  `;

  return (
    <div className="comment-container" css={style}>
      <p><span className="comment-user">{props.firstName + " " + props.lastName}</span><span className="comment-time">{formatTime(props.time)}</span></p>
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