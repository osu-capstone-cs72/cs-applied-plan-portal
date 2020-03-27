/** @jsx jsx */

import {css, jsx} from "@emotion/core";

import {useState} from "react";
import Navbar from "../navbar/Navbar";
import PageSpinner from "../general/PageSpinner";
import ErrorMessage from "../general/ErrorMessage";
import FindUsers from "./FindUsers";
import SearchResults from "./SearchResults";
import {getToken} from "../../utils/authService";

export default function ManageRoles() {

  const [loading, setLoading] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchFields, setSearchFields] = useState({
    textValue: "*",
    roleValue: 3
  });
  const [cursor, setCursor] = useState({
    primary: "null",
    secondary: "null"
  });

  const style = css`

    #user-manage-container {
      margin: 100px 0 auto;
      width: 100%;
    }

    #user-manage-contents-container {
      margin: 25px auto;
      width: 50%;
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

  return (
    <div css={style}>
      <PageSpinner loading={loading} subloading={subloading} />
      <Navbar />

      <div id="user-manage-container">
        <div id="user-manage-contents-container">

          <FindUsers onSearch={cursor => searchUsers(cursor, true)}/>

          <SearchResults users={users} cursor={cursor} loading={loading}
            onLoading={load => setSubloading(load)} error={errorMessage}
            onLoadMore={cursor => searchUsers(cursor, false)} />

        </div>
      </div>

    </div>
  );
}