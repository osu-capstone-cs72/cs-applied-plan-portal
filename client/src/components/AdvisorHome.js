/** @jsx jsx */

import NavBar from "./Navbar";
import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {getToken} from "../utils/authService";
import {formatTime} from "../utils/formatTime";
import PageInternalError from "./general/PageInternalError";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function AdvisorHome() {

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentPlans, setRecentPlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchFields, setSearchFields] = useState({
    textValue: "*",
    searchValue: 0,
    statusValue: 0,
    sortValue: 0,
    orderValue: 0
  });

  const style = css`

    #advisor-home-container {
      position: absolute;
      top: 75px;
      margin: 0 auto;
      width: 100%;
    }

    #advisor-home-contents-container {
      margin: 25px auto;
      width: 50%;
    }

    #plan-search-container {
      padding: 10px;
      border: 1px solid black;
      margin: 25px auto;
      width: 100%;
    }

    .table-container {
      text-align: center;
      border: 1px solid black;
    }

    .home-error-message-container {
      text-align: center;
      margin: 0 auto;
    }

    .advisor-plans-table {
      text-align: left;
      margin: 0 auto;
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

    th, td {
      padding: 10px;
    }

    #page-load-more-button {
      margin: 25px;
    }

  `;

  useEffect(() => {
    getRecentPlans();
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    searchPlans(1);
  }

  async function getRecentPlans() {
    try {
      setErrorMessage("");
      setLoading(true);
      setRecentPlans([]);

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/recent/?accessToken=${token}`;
      let obj = {};

      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {
        obj = await results.json();
        setRecentPlans(obj.plans);
      } else {
        // we got a bad status code.
        obj = await results.json();
        if (results.status === 500) {
          setPageError(500);
        }
      }
    } catch (err) {
      // send to 500 page if a server error happens while fetching plan
      setPageError(500);
    }
  }

  async function searchPlans(page) {
    try {
      setErrorMessage("");
      setLoading(true);

      const text = document.getElementById("input-search");
      let textValue = text.value;
      if (textValue === "") {
        textValue = "*";
      }

      const search = document.getElementById("select-search");
      let searchValue = search.options[search.selectedIndex].value;

      const status = document.getElementById("select-status");
      let statusValue = status.options[status.selectedIndex].value;

      const sort = document.getElementById("select-sort");
      let sortValue = sort.options[sort.selectedIndex].value;

      const order = document.getElementById("select-order");
      let orderValue = order.options[order.selectedIndex].value;

      // don't use search fields if we are just showing other pages of our results
      if (page > 1) {
        searchValue = searchFields.searchValue;
        statusValue = searchFields.statusValue;
        sortValue = searchFields.sortValue;
        orderValue = searchFields.orderValue;
      } else {
        setSearchFields({
          searchValue: searchValue,
          statusValue: statusValue,
          sortValue: sortValue,
          orderValue: orderValue
        });
      }

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/search/${textValue}/${searchValue}/${statusValue}/` +
        `${sortValue}/${orderValue}/${page}/?accessToken=${token}`;
      let obj = {};

      // get our search results
      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {

        // if this is a new search clear all of the previous results
        obj = await results.json();
        if (page > 1) {
          setPlans([...plans, ...obj.plans]);
        } else {
          setPlans([...obj.plans]);
        }
        setPageNumber(obj.page);
        setTotalPages(obj.totalPages);

      } else {
        // we got a bad status code. Show the error
        obj = await results.json();
        setErrorMessage(obj.error);
        if (results.status === 500) {
          setErrorMessage("An internal server error occurred. Please try again later.");
        }
      }
    } catch (err) {
      // show error message if error while searching
      setErrorMessage("An internal server error occurred. Please try again later.");
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
        <div id="advisor-home-container">
          <div id="advisor-home-contents-container">

            {recentPlans.length ? (
              <div className="table-container">
                <h3>Recently Viewed Plans</h3>
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
                    {recentPlans.map(plan =>
                      <tr key={plan.planId} onClick={() => goToPlan(plan)}>
                        <td className="student-plans-data" key={plan.planId + "a"}>
                          {plan.firstName + " " + plan.lastName}
                        </td>
                        <td className="student-plans-data" key={plan.planId + "b"}>{plan.userId}</td>
                        <td className="student-plans-data" key={plan.planId + "c"}>{plan.planName}</td>
                        <td className="student-plans-data" key={plan.planId + "d"}>{renderStatus(plan.status)}</td>
                        <td className="student-plans-data" key={plan.planId + "e"}>{formatTime(plan.created)}</td>
                        <td className="student-plans-data" key={plan.planId + "f"}>{formatTime(plan.lastUpdated)}</td>

                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              null
            )}

            <div id="plan-search-container">
              <form id="search-form" onSubmit={e => submitHandler(e)}>
                <input type="text" id="input-search" />
                <button id="search-plan-button" onClick={() => { searchPlans(1); }}>
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

            <div className="home-error-message-container">{errorMessage}</div>
            {plans.length ? (
              <div className="table-container">
                <h3>Search Results</h3>
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
                    {plans.map(plan =>
                      <tr key={plan.planId} onClick={() => goToPlan(plan)}>
                        <td className="student-plans-data" key={plan.planId + "a"}>
                          {plan.firstName + " " + plan.lastName}
                        </td>
                        <td className="student-plans-data" key={plan.planId + "b"}>{plan.userId}</td>
                        <td className="student-plans-data" key={plan.planId + "c"}>{plan.planName}</td>
                        <td className="student-plans-data" key={plan.planId + "d"}>{renderStatus(plan.status)}</td>
                        <td className="student-plans-data" key={plan.planId + "e"}>{formatTime(plan.created)}</td>
                        <td className="student-plans-data" key={plan.planId + "f"}>{formatTime(plan.lastUpdated)}</td>

                      </tr>
                    )}
                  </tbody>
                </table>
                { pageNumber < totalPages ? (
                  <button id="page-load-more-button" onClick={() => searchPlans(pageNumber + 1)}>Show More</button>
                ) : (
                  null
                )}
              </div>
            ) : (
              null
            )}

          </div>
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
