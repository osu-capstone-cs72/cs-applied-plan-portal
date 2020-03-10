/** @jsx jsx */

import {css, jsx} from "@emotion/core";

import {useState} from "react";
import Navbar from "../navbar/Navbar";
import {getToken} from "../../utils/authService";
import SelectRole from "./SelectRole";

export default function SetRoles() {

  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const style = css`

  #user-manage-container {
    position: absolute;
    top: 75px;
    width: 50%;
    left: 25%;
  }

  #user-search-container {
    padding: 10px;
    border: 1px solid black;
    margin: 25px auto;
    width: 100%;
  }

  #search-form {
    display: inline-block;
    margin: 0;
    padding: 10px;
    width: 100%;
  }

  #input-search {
    width: 90%;
  }

  #search-user-button {
    width: 10%;
  }

  #filter-container {
    display: inline-block;
    vertical-align: top;
    padding: 10px;
    width: 100%;
  }

  .user-filter {
      display:inline-block;
      margin-bottom: 10px;
      width: 100%;
    }

  .user-error-message-container {
    text-align: center;
    margin: 0 auto;
  }

  .table-container {
    text-align: center;
    border: 1px solid black;
  }

  .user-table {
      table-layout:fixed;
      text-align: left;
      margin: 0 auto;
    }

  th, td {
    padding: 10px;
    min-width: 150px;
  }

`;

  async function submitHandler(e) {

    // prevent the default behavior of the form button
    e.preventDefault();

    // get the search text from the search field
    let text = document.getElementById("input-search").value;

    // if search text is empty we use a special char to represent
    // any text response as valid
    if (text === "") {
      text = "*";
    }

    // get the role from the role select
    const roleSelect = document.getElementById("select-role");
    const role = roleSelect.options[roleSelect.selectedIndex].value;

    try {
      setErrorMessage("");

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/user/search/${text}/${role}/?accessToken=${token}`;
      let obj = [];

      const response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        setUsers(obj.users);

      } else {
        // we got a bad status code. Show the error
        setUsers([]);
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
    <div css={style}>
      <Navbar />

      <div id="user-manage-container">

        <div id="user-search-container">

          <form id="search-form" onSubmit={(e) => submitHandler(e)}>
            <input type="text" id="input-search" />
            <button id="search-user-button">
              Search
            </button>
          </form>

          <div id="filter-container">

            <select id="select-role" className="user-filter" defaultValue={"3"}>
              <option value="3">Any role</option>
              <option value="0">Student</option>
              <option value="1">Advisor</option>
              <option value="2">Head Advisor</option>
            </select>

          </div>

        </div>

        <div className="user-error-message-container">{errorMessage}</div>

        {users.length > 0 ? (
          <div className="table-container" css={style}>
            <h3>Search Results</h3>
            <table className="user-table">
              <tbody>
                <tr>
                  <th className="user-data"> User Name </th>
                  <th className="user-data"> User ID </th>
                  <th className="user-data"> Email </th>
                  <th className="user-data"> Role </th>
                </tr>
                {users.map(user =>
                  <tr key={user.userId}>
                    <td className="user-data" key={user.userId + "a"}>
                      {user.firstName + " " + user.lastName}
                    </td>
                    <td className="user-data" key={user.userId + "b"}>{user.userId}</td>
                    <td className="user-data" key={user.userId + "c"}>{user.email}</td>
                    <td className="user-data" key={user.userId + "d"}>
                      <SelectRole role={user.role} userId={user.userId}
                        userName={user.firstName + " " + user.lastName}/>
                    </td>


                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          null
        )}

      </div>
    </div>
  );
}