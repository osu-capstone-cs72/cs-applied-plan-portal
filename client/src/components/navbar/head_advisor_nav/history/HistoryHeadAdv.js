import React from "react";
import {Desktop, Mobile} from "../../../../utils/responsiveUI";
import HistoryCommon from "../../history/HistoryCommon";
import PropTypes from "prop-types";
import HistoryHeadAdvMobile from "../../history/HistoryHeadAdvMobile";

function HistoryHeadAdv({recentPlans}) {
  return (
    <React.Fragment>
      <Desktop>
        <HistoryCommon recentPlans={recentPlans} />
      </Desktop>
      <Mobile>
        <HistoryHeadAdvMobile recentPlans={recentPlans}/>
      </Mobile>
    </React.Fragment>
  );
}

export default HistoryHeadAdv;

HistoryHeadAdv.propTypes = {
  recentPlans: PropTypes.array,
};