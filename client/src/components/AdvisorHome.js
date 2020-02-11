/** @jsx jsx */

import NavBar from "./Navbar";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import BounceLoader  from "react-spinners/BounceLoader";


function AdvisorHome(props) {

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const style = css`
  .loader-container {
      visibility: ${loading ? "visible" : "hidden"};
      position: fixed;
      margin-left: -75px;
      margin-bottom: 75px;
      left: 50%;
      bottom: 50%;
      width: 0;
      height: 0;
      z-index: 99;
    }
  }`;

  useEffect(() => {
    async function fetchPlans() {
      try {
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const getUrl = `http://${server}/user/1/plans`;
        let obj = [];

        const results = await fetch(getUrl);
        setLoading(false);
        if (results.ok) {
          obj = await results.json();
          setPlans(obj);
        } else {
          // we got a bad status code. Show the error
          obj = await results.json();
          setErrorMessage(obj.error);
        }
      } catch (err) {
        // send to 500 page if a server error happens while fetching plan
        console.log("An internal server error occurred. Please try again later.");
        props.history.push("/500");
        return;
      }
    }
    fetchPlans();
  }, [props.history]);

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
      <div className="loader-container">
        <BounceLoader
          size={150}
          color={"orange"}
        />
      </div>
      <NavBar showSearch={true} searchContent={"Search for plans"}/>
      <div className="home-error-message-container">{errorMessage}</div>
      <table className="student-plans-table">
        <tbody>
          <tr>
            <th className="student-plans-data">Name</th>
            <th className="student-plans-data">Status</th>
            <th className="student-plans-data">Updated</th>
            <th className="student-plans-data">Reviewers</th>
          </tr>
          {plans ? plans.map(plan =>
            <tr key={plan.planId} onClick={() => goToPlan(plan)}>
              <td className="student-plans-data" key={plan.planId + "a"}>{plan.planName}</td>
              <td className="student-plans-data" key={plan.planId + "b"}>{renderStatus(plan.status)}</td>
              <td className="student-plans-data" key={plan.planId + "c"}>{plan.lastUpdated}</td>
            </tr>) : null}
        </tbody>
      </table>
    </div>
  );
}
export default withRouter(AdvisorHome);

AdvisorHome.propTypes = {
  history: PropTypes.object
};