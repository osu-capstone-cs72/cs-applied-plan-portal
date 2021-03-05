/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { MOBILE_WIDTH, SCREENWIDTH } from "../../utils/constants";
import { BOX_SHADOW_CARD } from "../../utils/constants";
// search form for finding users
function FindUsers(props) {
  const style = css`
    & {
      padding: 10px;
      border-radius: 0.5rem;
      box-shadow: ${BOX_SHADOW_CARD};
      background: white;
      margin: 25px auto;
      width: 50%;
    }

    h2 {
      text-align: center;
    }

    #search-form {
      display: flex;
      margin: 0;
      padding: 10px;
      width: 100%;
      align-items: stretch;
      justify-content: stretch;
    }

    #input-search {
      border: 1px solid var(--color-lightgray-600);
      border-radius: 0.5rem;
      padding: 0rem 1rem;
      flex: 100%;
    }

    #search-user-button {
      background: var(--color-orange-500);
      color: var(--color-orange-50);
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
      margin-left: 1rem;
    }

    #filter-container {
      display: flex;
      padding: 10px;
      width: 100%;
    }

    .user-filter {
      display: inline-block;
      width: 100%;
      border: 1px solid var(--color-lightgray-600);
      border-radius: 0.5rem;
      padding: 1rem 1rem;
      flex: 100%;
    }
    @media screen and (max-width: ${SCREENWIDTH.MOBILE.MAX}px) {
      & {
        width: ${MOBILE_WIDTH};
      }
    }
  `;

  // perform a new user search when form is submitted
  function submitHandler(e) {
    // prevent the default behavior of the form button
    e.preventDefault();

    // perform a new search for users
    const newCursor = {
      primary: "null",
      secondary: "null",
    };

    props.onSearch(newCursor);
  }

  return (
    <div id="user-search-container" css={style}>
      <h2>Search Users</h2>

      <form id="search-form" onSubmit={(e) => submitHandler(e)}>
        <input
          type="text"
          id="input-search"
          placeholder="Search for users..."
        />
        <button id="search-user-button">Search</button>
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
  );
}
export default FindUsers;

FindUsers.propTypes = {
  onSearch: PropTypes.func,
};
