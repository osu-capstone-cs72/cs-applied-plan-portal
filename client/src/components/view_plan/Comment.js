/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function Comment(props) {

  const styleCommentContainer = css`
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    width: 350px;
    background-color: #b3b3b3;
    word-wrap: break-word;
    overflow-wrap: break-word;
  `;

  const styleCommentUser = css`
    font-weight: bold;
    font-size: large;
  `;

  const styleCommentTime = css`
    font-style: italic;
  `;

  const styleCommentText = css`
    font-size: large;
  `;

  const [userName, setUserName] = useState("");

  useEffect(() => {

    async function fetchUsername() {
      // don't try searching for user name if ID is zero
      if (props.userId === 0) {
        return;
      }

      try {
        // get user name
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const url = `http://${server}/user/${props.userId}`;
        const response = await fetch(url);
        if (response.ok) {
          // get data from the response
          const obj = await response.json();
          setUserName(obj.firstName + " " + obj.lastName);
        }
      } catch (err) {
        // this is a server error
        alert("An internal server error occurred. Please try again later.");
      }
    }
    fetchUsername();
  }, []);

  if (props.commentId !== 0) {
    return (
      <div className="comment-container" css={styleCommentContainer}>
        <p className="comment-user" css={styleCommentUser}>{userName}</p>
        <p className="comment-time" css={styleCommentTime}>{props.time}</p>
        <p className="comment-text" css={styleCommentText}>{props.text}</p>
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
  userId: PropTypes.number,
  time: PropTypes.any,
  text: PropTypes.string
};