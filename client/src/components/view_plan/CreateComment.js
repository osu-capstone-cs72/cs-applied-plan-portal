/** @jsx jsx */

import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {useParams} from "react-router-dom";

function CreateComment(props) {

  const [newComment, setNewComment] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const {planId} = useParams();

  const style = css`
    #comment-error-container {
      display: block;
      width: auto;
      min-width: 100px;
    }

    #comment-error-message {
      display:inline-block;
      min-height:15px;
    }

    #comment-input-container {
      display: inline-block;
      padding: 25px;
      background-color: #b3b3b3;
    }

    #comment-text-input {
      display: inline;
      margin: 10px;
      resize: none;
    }

    #submit-comment-button {
      display: block;
      margin: auto;
    }
  `;

  function toggle() {
    setErrorMessage("");
    setNewComment(!newComment);
  }

  async function submit(planId) {

    try {

      const text = document.getElementById("comment-text-input").value;

      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/comment`;
      let obj = [];

      const postObj = {
        planId: planId,
        userId: props.currentUser.id,
        text: text
      };

      // post new comment
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postObj),
      });
      if (response.ok) {
        // show the new comment and close window
        obj = await response.json();
        setErrorMessage("");
        setNewComment(!newComment);
        props.onNewComment({
          firstName: props.currentUser.firstName,
          lastName: props.currentUser.lastName,
          commentId: obj.insertId,
          time: obj.time,
          planId: planId,
          userId: props.currentUser.id,
          text: text
        }); // lift state up
      } else {
        // we got a bad status code. Show the error
        obj = await response.json();
        setErrorMessage(obj.error);
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }

  }

  if (newComment) {
    return (
      <div id="create-comment-container" css={style}>
        <button className="toggle-creation-button" onClick={() => { toggle(); }}>
          +
        </button>
      </div>
    );
  } else {
    return (
      <div id="create-comment-container" css={style}>
        <button className="toggle-creation-button" onClick={() => { toggle(); }}>
        -
        </button>
        <div id="comment-error-container">
          <p id="comment-error-message">{errorMessage}</p>
        </div>
        <div id="comment-input-container">
          <textarea id="comment-text-input" rows="5" cols="50"/>
          <button id="submit-comment-button" onClick={() => { submit(planId); }}>
            Submit Comment
          </button>
        </div>
      </div>
    );
  }

}
export default CreateComment;