/** @jsx jsx */

import NavBar from "./Navbar";
import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function AdvisorHome(props) {

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const style = css`

    #plan-data-container {
      margin: 0 auto;
      width: 50%;
    }

    #plan-selection-container {
      position: relative;
      top: 75px;
    }

    .home-error-message-container {
      position: relative;
      top: 100px;
    }
    
    .advisor-plans-table {
      position: relative;
      top: 100px;
    }

  `;

  useEffect(() => {
    fetchPlans();

  }, [props.history]);

  async function fetchPlans() {
    try {
      setErrorMessage("");
      setLoading(true);
      setPlans([]);

      const selectStatus = document.getElementById("select-status");
      const statusValue = selectStatus.options[selectStatus.selectedIndex].value;

      const selectTime = document.getElementById("select-time");
      const timeValue = selectTime.options[selectTime.selectedIndex].value;

      const selectOrder = document.getElementById("select-order");
      const orderValue = selectOrder.options[selectOrder.selectedIndex].value;

      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/status/${statusValue}/${timeValue}/${orderValue}` +
        `?accessToken=${props.token}`;
      let obj = {};

      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {
        obj = await results.json();
        setPlans(obj.data);
      } else {
        // we got a bad status code. Show the error
        obj = await results.json();
        setErrorMessage(obj.error);
      }
    } catch (err) {
      // send to 500 page if a server error happens while fetching plan
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
        return "Undefined status";
    }
  }

  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  return (
    <div css={style}>
      <PageSpinner loading={loading} />
      <NavBar showSearch={true} searchContent={"Search for plans"}/>
      <div id="plan-data-container">
        <div id="plan-selection-container">
          <select id="select-status" className="advisor-plan-select">
            <option value="5">Any</option>
            <option value="2">Awaiting Review</option>
            <option value="3">Awaiting final review</option>
            <option value="1">Awaiting student changes</option>
            <option value="4">Accepted</option>
            <option value="0">Rejected</option>
          </select>
          <select id="select-time" className="advisor-plan-select">
            <option value="1">Time Created</option>
            <option value="0">Time Updated</option>
          </select>
          <select id="select-order" className="advisor-plan-select">
            <option value="1">Ascending</option>
            <option value="0">Decending</option>
          </select>
          <button id="search-plan-status-button" onClick={() => { fetchPlans(); }}>
            Search
          </button>
        </div>
        <div className="home-error-message-container">{errorMessage}</div>
        <table className="advisor-plans-table">
          <tbody>
            <tr>
              <th className="student-plans-data">User Name</th>
              <th className="student-plans-data">User ID</th>
              <th className="student-plans-data">Plan Name</th>
              <th className="student-plans-data">Status</th>
              <th className="student-plans-data">Created</th>
              <th className="student-plans-data">Updated</th>
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
}
export default withRouter(AdvisorHome);

AdvisorHome.propTypes = {
  history: PropTypes.object,
  token: PropTypes.string
};