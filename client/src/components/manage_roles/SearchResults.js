/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { withRouter } from "react-router-dom";
import SelectRole from "./SelectRole";
import PropTypes from "prop-types";
import LoadMoreButton from "../general/LoadMoreButton";
import { Desktop, Mobile } from "../../utils/responsiveUI";
import React from "react";

// search results for a user search
function SearchResults(props) {
  const style = css`
    & {
      text-align: center;
      margin-top: 50px;
    }

    .user-table {
      table-layout: fixed;
      text-align: left;
      margin: 0 auto;
    }

    th,
    td {
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

    table {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }

    .prompt-container {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 10rem;
      background: var(--color-lightgray-50);
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
  `;

  return (
    <React.Fragment>
      <Desktop>
        {props.users.length ? (
          <div className="table-container" css={style}>
            <h3>Search Results</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-data">User Name</th>
                  <th className="user-data">User ID</th>
                  <th className="user-data">Email</th>
                  <th className="user-data">Role</th>
                </tr>
              </thead>
              <tbody>
                {props.users.map((user, index) => (
                  <tr key={user.userId}>
                    <td className="user-data" key={user.userId + "a"}>
                      {user.firstName + " " + user.lastName}
                    </td>
                    <td className="user-data" key={user.userId + "b"}>
                      {user.userId}
                    </td>
                    <td className="user-data" key={user.userId + "c"}>
                      {user.email}
                    </td>
                    <td className="user-data" key={user.userId + "d"}>
                      <SelectRole
                        role={user.role}
                        userId={user.userId}
                        index={index}
                        userName={user.firstName + " " + user.lastName}
                        onLoading={(load) => props.onLoading(load)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {props.cursor.primary === "null" ? null : (
              <LoadMoreButton
                onUpdate={() => props.onLoadMore(props.cursor)}
                loading={props.loading}
              />
            )}
          </div>
        ) : (
          <div css={style}>
            <div className="prompt-container">
              {props.error === "" ? (
                <h3>Search for users...</h3>
              ) : (
                <h3>{props.error}</h3>
              )}
            </div>
          </div>
        )}
      </Desktop>
      <Mobile>mobile stuff</Mobile>
    </React.Fragment>
  );
}
export default withRouter(SearchResults);

SearchResults.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  history: PropTypes.object,
  users: PropTypes.array,
  cursor: PropTypes.object,
  onLoadMore: PropTypes.func,
  onLoading: PropTypes.func,
};
