/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function FindPlans(props) {

  const style = css`
    padding: 10px;
    border: 1px solid black;
    margin: 25px auto;
    width: 100%;

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
    props.onSearch("null", "null");
  }

  return (
    <div id="plan-search-container" css={style}>

      <form id="search-form" onSubmit={e => submitHandler(e)}>
        <input type="text" id="input-search" />
        <button id="search-plan-button" onClick={() => { props.onSearch("null", "null"); }}>
          Search
        </button>
      </form>

      <div id="filter-container">

        <label className="filter-label">Search By</label>
        <select id="select-search" className="advisor-plan-filter" defaultValue={"0"}>
          <option value="0">User Name</option>
          <option value="1">User ID</option>
          <option value="2">Plan Name</option>
        </select>

        <label className="filter-label">Status</label>
        <select id="select-status" className="advisor-plan-filter" defaultValue={"5"}>
          <option value="5">Any</option>
          <option value="2">Awaiting Review</option>
          <option value="3">Awaiting final review</option>
          <option value="1">Awaiting student changes</option>
          <option value="4">Accepted</option>
          <option value="0">Rejected</option>
        </select>

        <label className="filter-label">Sort By</label>
        <select id="select-sort" className="advisor-plan-filter" defaultValue={"5"}>
          <option value="0">User Name</option>
          <option value="1">User ID</option>
          <option value="2">Plan Name</option>
          <option value="3">Status</option>
          <option value="4">Time Created</option>
          <option value="5">Time Updated</option>
        </select>

        <label className="filter-label">Order</label>
        <select id="select-order" className="advisor-plan-filter" defaultValue={"1"}>
          <option value="1">Ascending</option>
          <option value="0">Decending</option>
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
