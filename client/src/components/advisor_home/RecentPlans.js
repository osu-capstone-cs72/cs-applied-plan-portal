/** @jsx jsx */

import {formatTime} from "../../utils/formatTime";
import {renderStatus} from "../../utils/renderStatus";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function RecentPlans(props) {

  const style = css`
    text-align: center;
    border: 1px solid black;

    .advisor-plans-table {
      text-align: left;
      margin: 0 auto;
    }

    th, td {
      padding: 10px;
    }

  `;


  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  return (
    <div className="table-container" css={style}>
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
          {props.recentPlans.map(plan =>
            <tr key={plan.planId} onClick={() => goToPlan(plan)}>
              <td className="student-plans-data" key={plan.planId + "ra"}>
                {plan.firstName + " " + plan.lastName}
              </td>
              <td className="student-plans-data" key={plan.planId + "rb"}>{plan.userId}</td>
              <td className="student-plans-data" key={plan.planId + "rc"}>{plan.planName}</td>
              <td className="student-plans-data" key={plan.planId + "rd"}>{renderStatus(plan.status)}</td>
              <td className="student-plans-data" key={plan.planId + "re"}>{formatTime(plan.created)}</td>
              <td className="student-plans-data" key={plan.planId + "rf"}>{formatTime(plan.lastUpdated)}</td>

            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default withRouter(RecentPlans);

RecentPlans.propTypes = {
  history: PropTypes.object,
  recentPlans: PropTypes.array
};
