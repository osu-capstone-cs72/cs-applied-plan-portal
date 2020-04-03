/** @jsx jsx */

import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {useParams} from "react-router-dom";
import {getToken} from "../../utils/authService";
import ErrorMessage from "../general/ErrorMessage";

function CreateComment(props) {

  const [newComment, setNewComment] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const {planId} = useParams();

  const style = css`

    & {
      display: inline-block;
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
      border-radius: 0.5rem;
      border: 1px solid var(--color-lightgray-600);
    }

    #submit-comment-button {
      display: block;
      margin: auto;
    }
    
    .toggle-creation-button {
      /*background: none;*/
      /*border: 1px solid black;*/
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: var(--color-green-500);
      color: var(--color-green-50);
      /*padding: 1rem 1rem;*/
      border-radius: 0.5rem;
      border: none;
    }
    
    #submit-comment-button {
      display: block;
      margin: 10px auto;
      background: var(--color-blue-500);
      color: var(--color-blue-50);
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
    }
    
    .toggle-state-red {
      background: var(--color-red-500);
      color: var(--color-red-50);
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
          <button className="toggle-creation-button toggle-state-red" onClick={() => toggle()}>
            Discard
          </button>

          <ErrorMessage text={errorMessage} />

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