/** @jsx jsx */

import {useState} from "react";
import {css, jsx} from "@emotion/core";
import {useParams} from "react-router-dom";
import {getToken} from "../../utils/authService";
import PropTypes from "prop-types";

function CreateReview(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const {planId} = useParams();

  const style = css`
    margin: 50px auto;
    text-align: center;
    width: 100%;

      #review-error-container {
      display: block;
      width: auto;
      min-width: 100px;
    }

    #review-error-message {
      display:inline-block;
      min-height:15px;
    }

    #review-input-container {
      display: inline-block;
      padding: 25px;
    }

    #review-select {
      display: block;
      margin: auto;
    }

    #submit-review-button {
      display: block;
      margin: 10px auto;
    }
  `;

  async function submit(planId) {

    try {

      const selectStatus = document.getElementById("review-select");
      const statusValue = selectStatus.options[selectStatus.selectedIndex].value;

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/review/?accessToken=${token}`;
      let obj = [];

      const postObj = {
        planId: planId,
        status: statusValue
      };

      // post new review
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postObj),
      });
      if (response.ok) {
        // show the new review
        obj = await response.json();
        setErrorMessage("");
        props.onNewStatus({
          reviewId: obj.insertId,
          commentId: 0,
          firstName: props.currentUser.firstName,
          lastName: props.currentUser.lastName,
          time: obj.time,
          planId: planId,
          userId: props.currentUser.id,
          status: parseInt(statusValue)
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

  if (props.currentUser.role) {
    return (
      <div id="create-review-container" css={style}>
        <h2>Set Plan Status</h2>
        <div id="review-error-container">
          <p id="review-error-message">{errorMessage}</p>
        </div>
        <div id="review-input-container">
          <select id="review-select" defaultValue={"2"}>
            <option value="0">Rejected</option>
            <option value="1">Awaiting student changes</option>
            <option value="2">Awaiting review</option>
            <option value="3">Awaiting final review</option>
            <option value="4">Accepted</option>
          </select>
          <button id="submit-review-button" onClick={() => { submit(planId); }}>
            Change Status
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }

}
export default CreateReview;

CreateReview.propTypes = {
  currentUser: PropTypes.object,
  onNewStatus: PropTypes.func
};