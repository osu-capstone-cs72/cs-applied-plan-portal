/** @jsx jsx */
import React from "react";
import {jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import {Desktop, Mobile} from "../../../utils/responsiveUI";
import SearchResultsDesktop from "./SearchResultsDesktop";
import SearchResultsMobile from "./SearchResultsMobile";

// search results for a plan search
function SearchResults(props) {


  // redirects the user to the selected plan's 'view plan' page
  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  // if found any plan
  return (
    <React.Fragment>
      <Desktop>
        <SearchResultsDesktop props={props} goToPlan={goToPlan} />
      </Desktop>
      <Mobile>
        <SearchResultsMobile props={props} goToPlan={goToPlan} />
      </Mobile>
    </React.Fragment>
  );

}
export default withRouter(SearchResults);
