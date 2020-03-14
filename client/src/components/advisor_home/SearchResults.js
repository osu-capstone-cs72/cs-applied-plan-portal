/** @jsx jsx */

import {renderStatus} from "../../utils/renderStatus";
import {formatTime} from "../../utils/formatTime";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function SearchResults(props) {

  const style = css`
    text-align: center;
    margin-top: 50px;

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
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid black;
      background: transparent;
      margin-left: 1rem;
    }

    .active-sort { 
      color: #d73f09;
    }
    
    table {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }
    
    table thead tr th {
      background: var(--color-lightgray-100);
      color: var(--color-gray-400);
      font-variant-caps: all-small-caps;
      font-weight: 500;
      font-size: 12pt;
      border-bottom: none;
      padding: 1rem 2rem;
      /*padding: 10px;*/
      font-weight: bold;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
    }
    
    table tbody tr td {
      vertical-align: middle;
      padding: 1rem 2rem;
    }

  `;

  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

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
        <thead>
          <tr>
            {props.searchFields.sortValue === 0 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(0, true)}>
                  User Name <small>{props.searchFields.orderValue ? "▲" : "▼" }</small>
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(0, false)}>
                User Name <small>▼</small>
              </th>
            )}
            {props.searchFields.sortValue === 1 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(1, true)}>
                User ID <small>{props.searchFields.orderValue ? "▲" : "▼" }</small>
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(1, false)}>
                User ID <small>▼</small>
              </th>
            )}
            {props.searchFields.sortValue === 2 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(2, true)}>
                Plan Name <small>{props.searchFields.orderValue ? "▲" : "▼" }</small>
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(2, false)}>
                Plan Name <small>▼</small>
              </th>
            )}
            {props.searchFields.sortValue === 3 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(3, true)}>
                Status <small>{props.searchFields.orderValue ? "▲" : "▼" }</small>
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(3, false)}>
                Status <small>▼</small>
              </th>
            )}
            {props.searchFields.sortValue === 4 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(4, true)}>
                Time Created <small>{props.searchFields.orderValue ? "▲" : "▼" }</small>
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(4, false)}>
                Time Created <small>▼</small>
              </th>
            )}
            {props.searchFields.sortValue === 5 ? (
              <th className="student-plans-data active-sort" onClick={() => changeSort(5, true)}>
                Time Updated <small>{props.searchFields.orderValue ? "▲" : "▼" }</small>
              </th>
            ) : (
              <th className="student-plans-data" onClick={() => changeSort(5, false)}>
                Time Updated <small>▼</small>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
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