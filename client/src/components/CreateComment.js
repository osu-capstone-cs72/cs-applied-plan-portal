import React, {useState} from "react";
import {useParams} from "react-router-dom";

function CreateComment(props) {
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
      <button className="toggle-creation-button" onClick={() => { toggle(); }}>
        +
      </button>
    );
  } else {
    return (
      <div id="create-comment-container">
        <button className="toggle-creation-button" onClick={() => { toggle(); }}>
        -
        </button>
        <div id="comment-error-container">
          <p id="comment-error-message">{errorMessage}</p>
        </div>
        <div id="comment-input-container">
          <textarea id="comment-text-input" rows="5" cols="50" />
          <button id="submit-comment-button" onClick={() => { submit(planId); }}>
            Submit Comment
          </button>
        </div>
      </div>
    );
  }

}
export default CreateComment;