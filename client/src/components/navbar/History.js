/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";

function History() {

  const [recentPlans, setRecentPlans] = useState([]);

  const style = css`

    & {
      display: inline-block;
      height: 35px;
    }

    &:hover .dropdown-content {
      display: block;
    }

    .drop-button {
      height: 35px;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    .dropdown-content a {
      float: none;
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
    }

    .dropdown-content a:hover {
      background-color: #ddd;
    }

    .badge {
      position: absolute;
      top: 5px;
      right: 80px;
      padding: 5px 10px;
      border-radius: 50%;
      background-color: red;
      color: white;
    }
  `;

  // get the list of recent plans
  useEffect(() => {
    getRecentPlans();
  }, []);

  // get the current users most recently viewed plans
  async function getRecentPlans() {
    try {
      const getUrl = `api/plan/recent`;
      let obj = {};

      const results = await fetch(getUrl);
      if (results.ok) {
        obj = await results.json();
        setRecentPlans(obj.plans);
      } else {
        // we got a bad status code.
        if (results.status === 500) {
          console.error("An internal server error occurred. Please try again later.");
        }
      }
    } catch (err) {
      // log server error
      console.error("An internal server error occurred. Please try again later.");
    }
  }

  return (
    <div className="history-dropdown" css={style}>
      <button className="drop-button">History
        <i className="fa fa-caret-down" />
      </button>
      <div className="dropdown-content">
        {recentPlans.map((item) => (
          <Link key={item.planId} to={`/viewPlan/${item.planId}`}>
            {item.planName} <br/>
            {item.firstName + " " + item.lastName}
          </Link>
        ))}
      </div>
    </div>
  );

}
export default withRouter(History);