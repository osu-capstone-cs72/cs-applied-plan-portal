/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import PropTypes from "prop-types";
import {
  SCREENWIDTH,
  MOBILE_WIDTH,
  BOX_SHADOW_CARD,
} from "../../utils/constants";

// search form for plans
function FindPlans(props) {
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

    #search-plan-button {
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

    .advisor-plan-filter {
      display: inline-block;
      width: 100%;
      border: 1px solid var(--color-lightgray-600);
      border-radius: 0.5rem;
      padding: 1rem 1rem;
      flex: 100%;
    }

    #select-status {
      background-color: white;
    }

    @media screen and (max-width: ${SCREENWIDTH.MOBILE.MAX}px) {
      & {
        width: ${MOBILE_WIDTH};
      }
    }
  `;

  // performs a new plan search when the form is submitted
  function submitHandler(e) {
    // prevent the default behavior of the form button
    e.preventDefault();
    // perform a new search for plans
    const newCursor = {
      primary: "null",
      secondary: "null",
    };

    props.onSearch(newCursor);
  }

  return (
    <div id="plan-search-container" css={style}>
      <h2>Search Plans</h2>

      <form id="search-form" onSubmit={(e) => submitHandler(e)}>
        <input
          type="text"
          id="input-search"
          placeholder="search for plans..."
        />
        <button id="search-plan-button">Search</button>
      </form>

      <div id="filter-container">
        <select
          id="select-status"
          className="advisor-plan-filter"
          defaultValue={"5"}
        >
          <option value="5">Any Status</option>
          <option value="2">Awaiting Review</option>
          <option value="3">Awaiting Final Review</option>
          <option value="1">Awaiting Student Changes</option>
          <option value="4">Accepted</option>
          <option value="0">Rejected</option>
        </select>
      </div>
    </div>
  );
}
export default FindPlans;

FindPlans.propTypes = {
  history: PropTypes.object,
  onSearch: PropTypes.func,
};
