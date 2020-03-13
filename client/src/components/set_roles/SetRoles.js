/** @jsx jsx */

import {css, jsx} from "@emotion/core";

import {useState} from "react";
import Navbar from "../navbar/Navbar";
import PageSpinner from "../general/PageSpinner";
import {getToken} from "../../utils/authService";
import SelectRole from "./SelectRole";

export default function SetRoles() {

  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [searchFields, setSearchFields] = useState({
    textValue: "*",
    roleValue: 3
  });
  const [cursor, setCursor] = useState({
    primary: "null",
    secondary: "null"
  });

  const style = css`

  h2 {
    text-align: center;
  }

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


  // search for users
  async function searchUsers(cursor, newSearch) {
    try {
      setErrorMessage("");
      setLoading(true);

      // get the search text from the search field
      let textValue = document.getElementById("input-search").value;

      // if search text is empty we use a special char to represent
      // any text response as valid
      if (textValue === "") {
        textValue = "*";
      }

      // get the role from the role select
      const roleSelect = document.getElementById("select-role");
      let roleValue = roleSelect.options[roleSelect.selectedIndex].value;

      // only set the search values if we are performing a new search
      if (newSearch) {

        setSearchFields({
          textValue: textValue,
          roleValue: roleValue
        });
      } else {
        textValue = searchFields.textValue;
        roleValue = searchFields.roleValue;
      }

      // construct the request url
      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/user/search/${textValue}/${roleValue}` +
        `/${cursor.primary}/${cursor.secondary}?accessToken=${token}`;
      let obj = [];

      // get our search results
      const results = await fetch(getUrl);

      if (results.ok) {

        // if the cursor is new then we will want to relist users
        obj = await results.json();
        if (cursor.primary === "null") {
          setUsers([...obj.users]);
        } else {
          setUsers([...users, ...obj.users]);
        }
        setCursor(obj.nextCursor);

      } else {
        // we got a bad status code. Show the error
        obj = await results.json();
        setErrorMessage(obj.error);
        if (results.status === 500) {
          setErrorMessage("An internal server error occurred. Please try again later.");
        }
        setUsers([]);
      }
    } catch (err) {
      // show error message if error while searching
      setErrorMessage("An internal server error occurred. Please try again later.");
    }
    setLoading(false);
  }

  // perform a new user search when form is submitted
  function submitHandler(e) {

    // prevent the default behavior of the form button
    e.preventDefault();

    // perform a new search for users
    const newCursor = {
      primary: "null",
      secondary: "null"
    };
    searchUsers(newCursor, true);

  }

  // perform a continued user search when the 'show more' button is pressed
  function loadMore() {
    searchUsers(cursor, false);
  }

  return (
    <div css={style}>
      <PageSpinner loading={loading} subloading={subloading} />
      <Navbar />

      <div id="user-manage-container">

        <div id="user-search-container">

          <h2>Search Users</h2>

          <form id="search-form" onSubmit={(e) => submitHandler(e)}>
            <input type="text" id="input-search" />
            <button id="search-user-button">
              Search
            </button>
          </form>

          <div id="filter-container">

            <select id="select-role" className="user-filter" defaultValue={"3"}>
              <option value="3">Any Role</option>
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
                {users.map((user, index) =>
                  <tr key={user.userId}>
                    <td className="user-data" key={user.userId + "a"}>
                      {user.firstName + " " + user.lastName}
                    </td>
                    <td className="user-data" key={user.userId + "b"}>{user.userId}</td>
                    <td className="user-data" key={user.userId + "c"}>{user.email}</td>
                    <td className="user-data" key={user.userId + "d"}>
                      <SelectRole role={user.role} userId={user.userId} index={index}
                        userName={user.firstName + " " + user.lastName} onLoading={load => setSubloading(load)} />
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
            { cursor.primary === "null" ? (
              null
            ) : (
              <button id="page-load-more-button"
                onClick={() => loadMore() }>
                Show More
              </button>
            )}
          </div>
        ) : (
          null
        )}

      </div>
    </div>
  );
}