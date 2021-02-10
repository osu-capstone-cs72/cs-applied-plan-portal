import React from "react";
import {Desktop, Mobile} from "../../../utils/responsiveUI";
import HeadAdvisorNavDesktop from "./HeadAdvisorNavDesktop";
import HeadAdvisorNavMobile from "./HeadAdvisorNavMobile";
import propTypes from "prop-types";

function HeadAdvisorNav(props) {

  return (
    <>
      <Mobile>
        <HeadAdvisorNavMobile currentPlan={props.currentPlan} />
      </Mobile>
      <Desktop>
        <HeadAdvisorNavDesktop currentPlan={props.currentPlan} />
      </Desktop>
    </>
  );
}

export default HeadAdvisorNav;

HeadAdvisorNav.propTypes = {
  currentPlan: propTypes.number
};