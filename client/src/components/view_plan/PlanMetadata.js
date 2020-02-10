/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {useParams, withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function PlanMetadata(props) {

  const style = css`
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    height: 110px;

    .plan-metadata {
      padding: 10px;
      text-align: center;
      vertical-align: middle;
      width: 100%;
      height: 75px;
      background-color: #c0c0c0;
    }

    .metadata-field {
      vertical-align: top;
      display: inline-block;
      width: 20%;
      height: 55px;
    }

    .field-type {
      font-weight: bold;
      vertical-align: middle;
    }

    .field-text {
      font-weight: normal;
      vertical-align: middle;
    }

    #edit-plan-button {
      padding: 10px;
    }
  `;

  const {planId} = useParams();

  function goToEditPlan(planId) {
    props.history.push(`/editPlan/${planId}`);
  }

  function renderStatus() {
    switch (props.status) {
      case 0:
        return "Rejected";
      case 1:
        return "Awaiting student changes";
      case 2:
        return "Awaiting review";
      case 3:
        return "Awaiting final review";
      case 4:
        return "Accepted";
      default:
        return "Undefined status";
    }
  }

  return (
    <div className="metadata-container" css={style}>
      <div className="plan-metadata">
        <div className="metadata-field">
          <p className="field-type">Student Name:</p>
          <p className="field-text">{props.studentName}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">User ID:</p>
          <p className="field-text">{props.userId}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Plan Name:</p>
          <p className="field-text">{props.planName}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Plan Status:</p>
          <p className="field-text">{renderStatus()}</p>
        </div>
        <div className="metadata-field">
          <button id="edit-plan-button" onClick={() => { goToEditPlan(planId); }}>
              Edit Plan
          </button>
        </div>
      </div>
    </div>
  );

}
export default withRouter(PlanMetadata);

PlanMetadata.propTypes = {
  studentName: PropTypes.string,
  userId: PropTypes.number,
  planName: PropTypes.string,
  status: PropTypes.number,
  history: PropTypes.object
};