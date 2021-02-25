/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";
import { withRouter } from "react-router-dom";
import { Desktop, Mobile } from "../../../utils/responsiveUI";
import SearchResultsDesktop from "./SearchResultsDesktop";
import SearchResultsMobile from "./SearchResultsMobile";

// search results for a plan search
function SearchResults(props) {

  return (
    <React.Fragment>
      <Desktop>
        <SearchResultsDesktop props={props} />
      </Desktop>
      <Mobile>
        <SearchResultsMobile props={props} />
      </Mobile>
    </React.Fragment>
  );

}
export default withRouter(SearchResults);
