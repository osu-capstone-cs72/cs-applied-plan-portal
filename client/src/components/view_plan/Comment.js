/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import BeatLoader  from "react-spinners/BeatLoader";
import PropTypes from "prop-types";

function Comment(props) {

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const style = css`
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    width: 350px;
    background-color: #b3b3b3;
    word-wrap: break-word;
    overflow-wrap: break-word;

    .comment-loader-container {
      display: ${loading ? "block" : "none"};
      margin: auto;
      width: 250px;
      height: 25px;
    }

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

  useEffect(() => {

    async function fetchUsername() {
      try {
        // get user name
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const url = `http://${server}/user/${props.userId}`;
        const response = await fetch(url);
        if (response.ok) {
          // get data from the response
          const obj = await response.json();
          setUserName(obj.firstName + " " + obj.lastName);
          setLoading(false);
        }
      } catch (err) {
        // this is a server error
        console.log("An internal server error occurred. Please try again later.");
      }
    }
    fetchUsername();
  }, [props.userId]);

  if (props.commentId !== 0) {
    return (
      <div className="comment-container" css={style}>
        <div className="comment-loader-container">
          <BeatLoader>
            size={150}
            color={"black"}
            rotate={90}
          </BeatLoader>
        </div>
        <p className="comment-user">{userName}</p>
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
  userId: PropTypes.number,
  time: PropTypes.string,
  text: PropTypes.string
};