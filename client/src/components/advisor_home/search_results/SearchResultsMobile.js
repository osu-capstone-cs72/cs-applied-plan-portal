/* eslint-disable react/prop-types */
/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import LoadMoreButton from "../../general/LoadMoreButton";
import { MOBILE_WIDTH, BOX_SHADOW_CARD } from "../../../utils/constants";
import SearchResultsMobileCard from "./SearchResultsMobileCard";
import React from "react";

function SearchResultsMobile({
  props: { error, loading, plans, cursor, onLoadMore },
  goToPlan,
}) {
  const mobileStyle = css`
    .prompt-container {
      background: white;
      box-shadow: ${BOX_SHADOW_CARD};
      border-radius: 0.5rem;
      padding: 1rem;
      margin: auto;
      width: ${MOBILE_WIDTH};
      text-align: center;

      h3 {
        margin: 10px;
      }
    }

    ,
    ul {
      padding: 0;
    }

    ,
    li {
      list-style: none;
    }
  `;
  const planList = plans.map((plan) => (
    <li key={plan.planId} onClick={() => goToPlan(plan)}>
      <SearchResultsMobileCard plan={plan} />
    </li>
  ));

  if (plans.length) {
    return (
      <div css={mobileStyle}>
        <h3 style={{ marginLeft: "1.5rem" }}>Search Results</h3>

        <ul>{planList}</ul>
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
      <React.Fragment>
        {error !== "" && (
          <div css={mobileStyle}>
            <div className="prompt-container">
              <h3>{error}</h3>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(SearchResultsMobile);

SearchResultsMobile.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  plans: PropTypes.array,
  cursor: PropTypes.object,
  searchFields: PropTypes.object,
  onLoadMore: PropTypes.func,
  onChangeSort: PropTypes.func,
};
