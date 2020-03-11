/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function FindPlans(props) {

  const style = css`
    padding: 10px;
    border: 1px solid black;
    margin: 25px auto;
    width: 100%;

    h2 {
      text-align: center;
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

    #search-plan-button {
      width: 10%;
    }

    #filter-container {
      display: inline-block;
      vertical-align: top;
      padding: 10px;
      width: 100%;
    }

    .advisor-plan-filter {
      display:inline-block;
      margin-bottom: 10px;
      width: 100%;
    }

  `;

  function submitHandler(e) {
    e.preventDefault();
    props.onSearch({primary: "null", secondary: "null"});
  }

  return (
    <div id="plan-search-container" css={style}>

      <h2>Search Plans</h2>

      <form id="search-form" onSubmit={e => submitHandler(e)}>
        <input type="text" id="input-search" />
        <button id="search-plan-button">
          Search
        </button>
      </form>

      <div id="filter-container">

        <select id="select-status" className="advisor-plan-filter" defaultValue={"5"}>
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
  onSearch: PropTypes.func
};
