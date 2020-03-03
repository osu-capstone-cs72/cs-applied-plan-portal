/** @jsx jsx */

import {renderStatus} from "../../utils/renderStatus";
import {formatTime} from "../../utils/formatTime";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function SearchResults(props) {

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

    #page-load-more-button {
      margin: 25px;
    }

  `;

  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  return (
    <div className="table-container" css={style}>
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
          {props.plans.map(plan =>
            <tr key={plan.planId} onClick={() => goToPlan(plan)}>
              <td className="student-plans-data" key={plan.planId + "sa"}>
                {plan.firstName + " " + plan.lastName}
              </td>
              <td className="student-plans-data" key={plan.planId + "sb"}>{plan.userId}</td>
              <td className="student-plans-data" key={plan.planId + "sc"}>{plan.planName}</td>
              <td className="student-plans-data" key={plan.planId + "sd"}>{renderStatus(plan.status)}</td>
              <td className="student-plans-data" key={plan.planId + "se"}>{formatTime(plan.created)}</td>
              <td className="student-plans-data" key={plan.planId + "sf"}>{formatTime(plan.lastUpdated)}</td>

            </tr>
          )}
        </tbody>
      </table>
      { props.pageNumber < props.totalPages ? (
        <button id="page-load-more-button" onClick={() => props.onLoadMore(props.pageNumber + 1)}>Show More</button>
      ) : (
        null
      )}
    </div>
  );

}
export default withRouter(SearchResults);

SearchResults.propTypes = {
  history: PropTypes.object,
  plans: PropTypes.array,
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
  onLoadMore: PropTypes.func
};