/** @jsx jsx */
import { statusText } from "../../../utils/renderStatus";
import { formatTime } from "../../../utils/formatTime";
import { css, jsx } from "@emotion/core";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import LoadMoreButton from "../../general/LoadMoreButton";
import React from "react";
import {
  BOX_SHADOW_CARD,
  MOBILE_WIDTH,
  SCREENWIDTH,
} from "../../../utils/constants";

function SearchResultsDesktop({
  props: {
    error,
    loading,
    plans,
    cursor,
    searchFields,
    onLoadMore,
    onChangeSort,
  },
  goToPlan,
}) {
  const desktopStyle = css`

    & {
      text-align: center;
      margin-top: 50px;
    }

    .advisor-plans-table {
      table-layout:fixed;
      text-align: left;
      margin: 0 auto;
    }

    th, td {
      padding: 10px;
      min-width: 150px;
    }

    .active-sort { 
      color: #d73f09;
    }
    
    table {
      border-radius: 0.5rem;
      box-shadow: ${BOX_SHADOW_CARD};
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }

    .prompt-container {
      border-radius: 0.5rem;
      box-shadow: ${BOX_SHADOW_CARD};
      overflow: hidden;
      padding: 10rem;
      background: white;
      margin: auto;
      width: 50%;
    }
    
    table thead tr th {
      background: #f4f2f1;
      color: #706c6b;
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

    table tbody tr {
      cursor: pointer;
    }

    tr:hover {
      background: rgba(0, 0, 0, 0.02);
    }

     @media screen and (max-width: ${SCREENWIDTH.MOBILE.MAX}px) {
      .prompt-container {
        width: ${MOBILE_WIDTH};
      }

  `;

  // updates the sorting order of the search results
  function changeSort(sortValue, alternateOrder) {
    if (alternateOrder) {
      onChangeSort(sortValue, 1 - searchFields.orderValue);
    } else {
      onChangeSort(sortValue, 1);
    }
  }

  if (plans.length) {
    return (
      <div className="table-container" css={desktopStyle}>
        <h3>Search Results</h3>
        <table className="advisor-plans-table">
          <thead>
            <tr>
              {searchFields.sortValue === 0 ? (
                <th
                  className="student-plans-data active-sort"
                  onClick={() => changeSort(0, true)}
                >
                  User Name <small>{searchFields.orderValue ? "▲" : "▼"}</small>
                </th>
              ) : (
                <th
                  className="student-plans-data"
                  onClick={() => changeSort(0, false)}
                >
                  User Name <small>▼</small>
                </th>
              )}
              {searchFields.sortValue === 1 ? (
                <th
                  className="student-plans-data active-sort"
                  onClick={() => changeSort(1, true)}
                >
                  User ID <small>{searchFields.orderValue ? "▲" : "▼"}</small>
                </th>
              ) : (
                <th
                  className="student-plans-data"
                  onClick={() => changeSort(1, false)}
                >
                  User ID <small>▼</small>
                </th>
              )}
              {searchFields.sortValue === 2 ? (
                <th
                  className="student-plans-data active-sort"
                  onClick={() => changeSort(2, true)}
                >
                  Plan Name <small>{searchFields.orderValue ? "▲" : "▼"}</small>
                </th>
              ) : (
                <th
                  className="student-plans-data"
                  onClick={() => changeSort(2, false)}
                >
                  Plan Name <small>▼</small>
                </th>
              )}
              {searchFields.sortValue === 3 ? (
                <th
                  className="student-plans-data active-sort"
                  onClick={() => changeSort(3, true)}
                >
                  Status <small>{searchFields.orderValue ? "▲" : "▼"}</small>
                </th>
              ) : (
                <th
                  className="student-plans-data"
                  onClick={() => changeSort(3, false)}
                >
                  Status <small>▼</small>
                </th>
              )}
              {searchFields.sortValue === 4 ? (
                <th
                  className="student-plans-data active-sort"
                  onClick={() => changeSort(4, true)}
                >
                  Time Created{" "}
                  <small>{searchFields.orderValue ? "▲" : "▼"}</small>
                </th>
              ) : (
                <th
                  className="student-plans-data"
                  onClick={() => changeSort(4, false)}
                >
                  Time Created <small>▼</small>
                </th>
              )}
              {searchFields.sortValue === 5 ? (
                <th
                  className="student-plans-data active-sort"
                  onClick={() => changeSort(5, true)}
                >
                  Time Updated{" "}
                  <small>{searchFields.orderValue ? "▲" : "▼"}</small>
                </th>
              ) : (
                <th
                  className="student-plans-data"
                  onClick={() => changeSort(5, false)}
                >
                  Time Updated <small>▼</small>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.planId} onClick={() => goToPlan(plan)}>
                <td className="student-plans-data" key={plan.planId + "sa"}>
                  {plan.firstName + " " + plan.lastName}
                </td>
                <td className="student-plans-data" key={plan.planId + "sb"}>
                  {plan.userId}
                </td>
                <td className="student-plans-data" key={plan.planId + "sc"}>
                  {plan.planName}
                </td>
                <td className="student-plans-data" key={plan.planId + "sd"}>
                  {statusText(plan.status)}
                </td>
                <td className="student-plans-data" key={plan.planId + "se"}>
                  {formatTime(plan.created)}
                </td>
                <td className="student-plans-data" key={plan.planId + "sf"}>
                  {formatTime(plan.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cursor.primary === "null" ? null : (
          <LoadMoreButton
            onUpdate={() => {
              onLoadMore(cursor);
              console.log(cursor);
            }}
            loading={loading}
          />
        )}
      </div>
    );
  } else {
    return (
      /* <div css={desktopStyle}>
        <div className="prompt-container">
          {error === "" ? <h3>Search for plans...</h3> : <h3>{error}</h3>}
        </div>
      </div> */
      <React.Fragment>
        {error !== "" && (
          <div css={desktopStyle}>
            <div className="prompt-container">
              <h3>{error}</h3>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(SearchResultsDesktop);

SearchResultsDesktop.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  plans: PropTypes.array,
  cursor: PropTypes.object,
  searchFields: PropTypes.object,
  onLoadMore: PropTypes.func,
  onChangeSort: PropTypes.func,
};
