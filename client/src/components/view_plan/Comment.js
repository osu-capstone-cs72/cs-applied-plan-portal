/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function Comment(props) {

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    width: 350px;
    background-color: #b3b3b3;
    word-wrap: break-word;
    overflow-wrap: break-word;

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

  if (props.commentId !== 0) {
    return (
      <div className="comment-container" css={style}>
        <p className="comment-user">{props.firstName + " " + props.lastName}</p>
        <p className="comment-time">{props.time}</p>
        <p className="comment-text">{props.text}</p>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }

}
export default Comment;

Comment.propTypes = {
  commentId: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  userId: PropTypes.number,
  time: PropTypes.string,
  text: PropTypes.string
};