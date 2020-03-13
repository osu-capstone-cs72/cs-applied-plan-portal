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
      table-layout:fixed;
      text-align: left;
      margin: 0 auto;
    }

    th, td {
      padding: 10px;
      min-width: 150px;
    }

    #page-load-more-button {
      margin: 25px;
    }

    .active-sort { 
      color: #d73f09;
    }

  `;

  // redirects the user to the selected plan's 'view plan' page
  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  // updates the sorting order of the search results
  function changeSort(sortValue, alternateOrder) {
    if (alternateOrder) {
      props.onChangeSort(sortValue, 1 - props.searchFields.orderValue);
    } else {
      props.onChangeSort(sortValue, 1);
    }
  }

  return (
    <div className="table-container" css={style}>
      <h3>Search Results</h3>
      <table className="advisor-plans-table">
        <tbody>
          <tr>
            {props.searchFields.sortValue === 0 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(0, true)}>
                  User Name {props.searchFields.orderValue ? "▲" : "▼" }
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(0, false)}>
                User Name ▼
              </th>
            )}
            {props.searchFields.sortValue === 1 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(1, true)}>
                User ID {props.searchFields.orderValue ? "▲" : "▼" }
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(1, false)}>
                User ID ▼
              </th>
            )}
            {props.searchFields.sortValue === 2 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(2, true)}>
                Plan Name {props.searchFields.orderValue ? "▲" : "▼" }
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(2, false)}>
                Plan Name ▼
              </th>
            )}
            {props.searchFields.sortValue === 3 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(3, true)}>
                Status {props.searchFields.orderValue ? "▲" : "▼" }
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(3, false)}>
                Status ▼
              </th>
            )}
            {props.searchFields.sortValue === 4 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(4, true)}>
                Time Created {props.searchFields.orderValue ? "▲" : "▼" }
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(4, false)}>
                Time Created ▼
              </th>
            )}
            {props.searchFields.sortValue === 5 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(5, true)}>
                Time Updated {props.searchFields.orderValue ? "▲" : "▼" }
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(5, false)}>
                Time Updated ▼
              </th>
            )}
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
      { props.cursor.primary === "null" ? (
        null
      ) : (
        <button id="page-load-more-button"
          onClick={() => props.onLoadMore(props.cursor) }>
          Show More
        </button>
      )}
    </div>
  );

}
export default withRouter(SearchResults);

SearchResults.propTypes = {
  history: PropTypes.object,
  plans: PropTypes.array,
  cursor: PropTypes.object,
  searchFields: PropTypes.object,
  onLoadMore: PropTypes.func,
  onChangeSort: PropTypes.func
};