/** @jsx jsx */

import {css, jsx} from "@emotion/core";

import {useState} from "react";
import Navbar from "./navbar/Navbar";
import {getToken} from "../utils/authService";

export default function SetRoles() {

  const [errorMessage, setErrorMessage] = useState("");

  const style = css`
  position: absolute;
  top: 75px;
  width: 50%;
  left: 25%;
  padding: 10px;
  border: 1px solid black;
  margin: 25px auto;

  #search-form {
    display: inline-block;
    margin: 0;
    padding: 10px;
    width: 100%;
  }

  #input-search {
    width: 90%;
  }

  #search-plan-button {
    width: 10%;
  }

  #filter-container {
    display: inline-block;
    vertical-align: top;
    padding: 10px;
    width: 100%;
  }

  #search-label {
    margin: 2px;
  }

  #first-name #last-name {
    margin-right: 2px;
  }

  .home-error-message-container {
    text-align: center;
    margin: 0 auto;
  }

`;

  async function submitHandler() {
    const first = document.getElementById("first-name-input").value;
    const last = document.getElementById("last-name-input").value;
    try {
      setErrorMessage("");

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/user?query=${first}/?accessToken=${token}`;
      let obj = [];

      const response = await fetch(url);
      if (response.ok) {
      // get data from the response
        obj = await response.json();
        alert(obj);

      } else {
        alert("bad status");
        // we got a bad status code. Show the error
        obj = await response.json();
        setErrorMessage(obj.error);
        if (response.status === 500) {
          setErrorMessage("An internal server error occurred. Please try again later.");
        }
        if (response.status === 404) {
          setErrorMessage("No users found.");
        }
      }
    } catch (err) {
      // this is a server error
      setErrorMessage("An internal server error occurred. Please try again later.");
    }
  }

  return (
    <div>
      <Navbar showSearch={false} searchContent={null}/>
      <div id="search-container" css={style}>

        <div className="home-error-message-container">{errorMessage}</div>

        <form id="search-form" onSubmit={e => submitHandler(e)}>
          <div id="first-name">
            <label id="search-label">First name</label>
            <input type="text" id="first-name-input" />
          </div>
          <div id="last-name">
            <label id="search-label">Last name</label>
            <input type="text" id="last-name-input" />
          </div>
          <button id="search-plan-button">
              Search
          </button>
        </form>

      </div>
    </div>
  );
}