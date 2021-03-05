/** @jsx jsx */

import { useState } from "react";
import { css, jsx } from "@emotion/core";
import { useParams } from "react-router-dom";
import ErrorMessage from "../general/ErrorMessage";
import PropTypes from "prop-types";
import { login } from "../../utils/authService";

// plan review creation menu
function CreateReview(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const { planId } = useParams();

  const style = css`

    & {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    #review-input-container {
      display: inline-block;
      padding: 25px;
    }

    #review-select {
      display: block;
      margin: auto;
      border: 1px solid var(--color-lightgray-600);
      border-radius: 0.5rem;
      padding: 1rem 1rem;
      flex: 100%;
    }

    #submit-review-button {
      display: block;
      margin: 10px auto;
      background: var(--color-blue-500);
      color: var(--color-blue-50);
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
    }

    @media print {
      & {
        display: none;
      }
    }

  `;

  async function submit(planId) {

    const selectStatus = document.getElementById("review-select");
    const statusValue = selectStatus.options[selectStatus.selectedIndex].value;
    const statusMessage = statusText(statusValue);

    if (window.confirm(`Are you sure that you want to set this plans status to "${statusMessage}"?`)) {
      try {

        const url = `/api/review`;
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
            id: obj.insertId + "r",
            firstName: props.currentUser.firstName,
            lastName: props.currentUser.lastName,
            time: obj.time,
            planId: planId,
            userId: props.currentUser.id,
            status: parseInt(statusValue)
          });
        } else if (response.status === 403) {
          // if the user is not allowed to create a review on this plan,
          // redirect to login to allow updating of user info
          login();
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

  }

  function statusText(status) {
    switch (status) {
      case "0":
        return "Rejected";
      case "1":
        return "Awaiting student changes";
      case "2":
        return "Awaiting review";
      case "3":
        return "Awaiting final review";
      case "4":
        return "Accepted";
      default:
        return "";
    }
  }

  if (props.currentUser.role && (props.currentUser.role !== 1 || (props.status !== 0 && props.status !== 4))) {
    return (
      <div id="create-review-container" css={style}>
        <h2>Set Plan Status</h2>

        <ErrorMessage text={errorMessage} />

        <div id="review-input-container">
          <select id="review-select" defaultValue={"2"}>
            {props.status === 0 ? (
              <option value="0" disabled={true}>Rejected</option>
            ) : (
                <option value="0">Rejected</option>
              )}
            {props.status === 1 ? (
              <option value="1" disabled={true}>Awaiting student changes</option>
            ) : (
                <option value="1">Awaiting student changes</option>
              )}
            {props.status === 2 ? (
              <option value="2" disabled={true}>Awaiting review</option>
            ) : (
                <option value="2">Awaiting review</option>
              )}
            {props.status === 3 ? (
              <option value="3" disabled={true}>Awaiting final review</option>
            ) : (
                <option value="3">Awaiting final review</option>
              )}
            {props.status === 4 || props.currentUser.role === 1 ? (
              <option value="4" disabled={true}>Accepted</option>
            ) : (
                <option value="4">Accepted</option>
              )}
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
  status: PropTypes.number,
  currentUser: PropTypes.object,
  onNewStatus: PropTypes.func
};