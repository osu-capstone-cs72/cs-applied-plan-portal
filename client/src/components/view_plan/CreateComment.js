/** @jsx jsx */

import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {useParams} from "react-router-dom";
import {getToken} from "../../utils/authService";

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
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background: white;
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
    
    .toggle-creation-button {
      background: none;
      border: 1px solid black;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
    }

    @media print {
      & {
        display: none;
      }
    }

  `;

  function toggle() {
    setErrorMessage("");
    setNewComment(!newComment);
  }

  async function submit(planId) {

    try {

      const text = document.getElementById("comment-text-input").value;

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/comment/?accessToken=${token}`;
      let obj = [];

      const postObj = {
        planId: planId,
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
          id: obj.insertId + "c",
          firstName: props.currentUser.firstName,
          lastName: props.currentUser.lastName,
          time: obj.time,
          planId: planId,
          userId: props.currentUser.id,
          text: text
        });
      } else {
        // we got a bad status code. Show the error
        obj = await response.json();
        setErrorMessage(obj.error);
      }

    } catch (err) {
      // this is a server error
      setErrorMessage("An internal server error occurred. Please try again later.");
    }

  }

  if (props.status !== 0 && props.status !== 4) {
    if (newComment) {
      return (
        <div id="create-comment-container" css={style}>
          <button className="toggle-creation-button" onClick={() => toggle()}>
            Add Comment
          </button>
        </div>
      );
    } else {
      return (
        <div id="create-comment-container" css={style}>
          <button className="toggle-creation-button" onClick={() => toggle()}>
            Cancel
          </button>
          <div id="comment-error-container">
            <p id="comment-error-message">{errorMessage}</p>
          </div>
          <div id="comment-input-container">
            <textarea id="comment-text-input" rows="5" cols="50"/>
            <button id="submit-comment-button" onClick={() => submit(planId)}>
              Submit
            </button>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }

}
export default CreateComment;