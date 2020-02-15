/** @jsx jsx */

import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {useParams} from "react-router-dom";

function CreateReview(props) {

  const [userId] = useState(0);
  const {planId} = useParams();

  const style = css`
  `;


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
        // setErrorMessage("");
        // setNewComment(!newComment);
        // props.onUpdate(); // lift state up
      } else {
        // we got a bad status code. Show the error
        obj = await response.json();
        // setErrorMessage(obj.error);
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }

  }

  return (
    <div id="create-review-container" css={style}>
      <select id="">
        <option value="0">Volvo</option>
        <option value="1">Saab</option>
        <option value="2">Mercedes</option>
        <option value="3">Audi</option>
      </select>
    </div>
  );

}
export default CreateReview;