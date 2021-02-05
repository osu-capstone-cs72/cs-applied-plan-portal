/* eslint-disable react/prop-types */
/** @jsx jsx */

import {statusText} from "../../utils/renderStatus";
import {formatTime} from "../../utils/formatTime";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {SCREENWIDTH, MOBILE_WIDTH} from "../../utils/constants";
import SearchResultsMobileCard from "./SearchResultsMobileCard";

function SearchResultsMobile({
  props: {
    error,
    loading,
    plans,
    cursor,
    searchFields,
  },
  goToPlan,
}) {
  const mobileStyle = css`

    .prompt-container {
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 0.5rem;
      padding: 1rem;
      margin: auto;
      width: ${MOBILE_WIDTH};
      text-align: center;

      h3 {
        margin: 10px;
      }
    },
    li {
      list-style: none;
    }
  `;
  const planList = plans.map(plan => (
    <li key={plan.planId}>
      <SearchResultsMobileCard plan={plan} />
    </li>
  ));

  if (plans.length) {
    return (
      <div css={mobileStyle}>
        <ul>
          {planList}
        </ul>
      </div>
    );
  } else {
    return (
      <div css={mobileStyle}>
        <div className="prompt-container">
          {error === "" ? <h3>Search for plans...</h3> : <h3>{error}</h3>}
        </div>
      </div>
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
