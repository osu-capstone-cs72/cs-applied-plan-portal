/** @jsx jsx */

import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {useParams} from "react-router-dom";

function CreateComment(props) {

  const styleCreationButton = css`
  `;

  const styleErrorContainer = css`
    display: block;
    width: auto;
    min-width: 100px;
  `;

  const styleErrorMessage = css`
    display:inline-block;
    min-height:15px;
  `;

  const styleInputContainer = css`
    display: inline-block;
    padding: 25px;
    background-color: #b3b3b3;
  `;

  const styleTextInput = css`
    display: inline;
    margin: 10px;
    resize: none;
  `;

  const styleSubmitCommentButton = css`
    display: block;
    margin: auto;
  `;

  const [newComment, setNewComment] = useState(true);
  const [userId] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const {planId} = useParams();

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
        userId: userId,
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
        props.onUpdate(); // lift state up
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
      <button className="toggle-creation-button"
        css={styleCreationButton} onClick={() => { toggle(); }}>
        +
      </button>
    );
  } else {
    return (
      <div id="create-comment-container">
        <button className="toggle-creation-button"
          css={styleCreationButton} onClick={() => { toggle(); }}>
        -
        </button>
        <div id="comment-error-container" css={styleErrorContainer}>
          <p id="comment-error-message" css={styleErrorMessage}>{errorMessage}</p>
        </div>
        <div id="comment-input-container" css={styleInputContainer}>
          <textarea id="comment-text-input" rows="5" cols="50" css={styleTextInput}/>
          <button id="submit-comment-button"
            css={styleSubmitCommentButton} onClick={() => { submit(planId); }}>
            Submit Comment
          </button>
        </div>
      </div>
    );
  }

}
export default CreateComment;