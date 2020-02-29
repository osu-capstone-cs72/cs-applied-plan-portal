/** @jsx jsx */

import NavBar from "./Navbar";
import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {getToken} from "../utils/authService";
import PageInternalError from "./general/PageInternalError";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function AdvisorHome() {

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(0);
  const [plans, setPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const style = css`

    #plan-data-container {
      margin: 0 auto;
      width: 50%;
    }

    #plan-search-container {
      position: relative;
      top: 75px;
      padding: 10px;
      border: 1px solid black;
    }

    .home-error-message-container {
      margin: 0 auto;
      text-align: center;
      position: relative;
      top: 100px;
    }

    .advisor-plans-table {
      margin: 0 auto;
      position: relative;
      top: 100px;
    }

    #plan-search-container {
      margin: 0 auto;
      width: 70%;
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
      width: 100%;
    }

    th, td {
      padding: 10px;
    }

  `;

  useEffect(() => {
    // fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      setErrorMessage("");
      setLoading(true);
      setPlans([]);

      const text = document.getElementById("input-search");
      let textValue = text.value;
      if (textValue === "") {
        textValue = "*";
      }

      const search = document.getElementById("select-search");
      const searchValue = search.options[search.selectedIndex].value;

      const status = document.getElementById("select-status");
      const statusValue = status.options[status.selectedIndex].value;

      const sort = document.getElementById("select-sort");
      const sortValue = sort.options[sort.selectedIndex].value;

      const order = document.getElementById("select-order");
      const orderValue = order.options[order.selectedIndex].value;

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/search/${textValue}/${searchValue}/${statusValue}/` +
        `${sortValue}/${orderValue}/?accessToken=${token}`;
      let obj = {};

      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {
        obj = await results.json();
        setPlans(obj.plans);
      } else {
        // we got a bad status code. Show the error
        obj = await results.json();
        setErrorMessage(obj.error);
        if (results.status === 500) {
          setPageError(500);
        }
      }
    } catch (err) {
      // send to 500 page if a server error happens while fetching plan
      setPageError(500);
    }
  }

  function renderStatus(status) {
    switch (status) {
      case 0:
        return "Rejected";
      case 1:
        return "Awaiting student changes";
      case 2:
        return "Awaiting review";
      case 3:
        return "Awaiting final review";
      case 4:
        return "Accepted";
      default:
        return "";
    }
  }

  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  if (!pageError) {
    return (
      <div css={style}>
        <PageSpinner loading={loading} />
        <NavBar />
        <div id="plan-data-container">

          <div id="plan-search-container">
            <div id="plan-search-bar">
              <input type="text" id="input-search" />
              <button id="search-plan-button" onClick={() => { fetchPlans(); }}>
                Search
              </button>
            </div>

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

          <div className="home-error-message-container">{errorMessage}</div>
          <table className="advisor-plans-table">
            <tbody>
              <tr>
                <th className="student-plans-data">User Name</th>
                <th className="student-plans-data">User ID</th>
                <th className="student-plans-data">Plan Name</th>
                <th className="student-plans-data">Status</th>
                <th className="student-plans-data">Time Created</th>
                <th className="student-plans-data">Time Updated</th>
              </tr>
              {plans ? plans.map(plan =>
                <tr key={plan.planId} onClick={() => goToPlan(plan)}>
                  <td className="student-plans-data" key={plan.planId + "a"}>
                    {plan.firstName + " " + plan.lastName}
                  </td>
                  <td className="student-plans-data" key={plan.planId + "b"}>{plan.userId}</td>
                  <td className="student-plans-data" key={plan.planId + "c"}>{plan.planName}</td>
                  <td className="student-plans-data" key={plan.planId + "d"}>{renderStatus(plan.status)}</td>
                  <td className="student-plans-data" key={plan.planId + "e"}>{plan.created}</td>
                  <td className="student-plans-data" key={plan.planId + "f"}>{plan.lastUpdated}</td>

                </tr>) : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <PageInternalError />;
  }
}
export default withRouter(AdvisorHome);

AdvisorHome.propTypes = {
  history: PropTypes.object
};
