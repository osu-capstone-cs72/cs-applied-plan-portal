/** @jsx jsx */
import {css, jsx} from "@emotion/react";
import PropTypes from "prop-types";
import {Desktop, Mobile} from "../../../utils/responsiveUI";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faHistory} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function HistoryCommon({recentPlans}) {
  const style = css`
    & {
      display: inline-block;
      height: 35px;
    }

    button:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    &:hover .dropdown-content {
      display: block;
    }

    .caret-down {
      margin-left: 4px;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .dropdown-content a {
      float: none;
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
    }

    .dropdown-content a:hover {
      background-color: #ddd;
    }

    .badge {
      position: absolute;
      top: 5px;
      right: 80px;
      padding: 5px 10px;
      border-radius: 50%;
      background-color: red;
      color: white;
    }
  `;
  return (
    <div className="history-dropdown" css={style}>
      <button className="drop-button">
        <Desktop>
          History
          <FontAwesomeIcon icon={faCaretDown} style={{margin: "0 5px"}}/>
        </Desktop>
        <Mobile>
          <FontAwesomeIcon icon={faHistory} size="xs" />
        </Mobile>
      </button>

      <div className="dropdown-content">
        {recentPlans.length ? (
          recentPlans.map((item) => (
            <Link key={item.planId} to={`/viewPlan/${item.planId}`}>
              {item.planName} <br />
              {item.firstName + " " + item.lastName}
            </Link>
          ))
        ) : (
          <Link to={`.`} onClick={(event) => event.preventDefault()}>
            <p>No recently visited plans</p>
          </Link>
        )}
      </div>
    </div>
  );
}

export default HistoryCommon;

HistoryCommon.propTypes = {
  recentPlans: PropTypes.array,
};
