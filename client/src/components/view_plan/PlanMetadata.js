/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {useParams, withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function PlanMetadata(props) {

  const stylePlanMetadata = css`
    padding: 10px;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    height: 75px;
    background-color: #c0c0c0;
  `;

  const styleMetadataField = css`
    vertical-align: top;
    display: inline-block;
    width: 20%;
    height: 200px;
  `;

  const styleFieldType = css`
    font-weight: bold;
    vertical-align: middle;
  `;

  const styleFieldText = css`
    font-weight: normal;
    vertical-align: middle;
  `;

  const styleEditPlanButton = css`
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
    <div className="plan-metadata" css={stylePlanMetadata}>
      <div className="metadata-field" css={styleMetadataField}>
        <p className="field-type" css={styleFieldType}>Student Name:</p>
        <p className="field-text" css={styleFieldText}>{props.studentName}</p>
      </div>
      <div className="metadata-field" css={styleMetadataField}>
        <p className="field-type" css={styleFieldType}>User ID:</p>
        <p className="field-text" css={styleFieldText}>{props.userId}</p>
      </div>
      <div className="metadata-field" css={styleMetadataField}>
        <p className="field-type" css={styleFieldType}>Plan Name:</p>
        <p className="field-text" css={styleFieldText}>{props.planName}</p>
      </div>
      <div className="metadata-field" css={styleMetadataField}>
        <p className="field-type" css={styleFieldType}>Plan Status:</p>
        <p className="field-text" css={styleFieldText}>{renderStatus()}</p>
      </div>
      <div className="metadata-field" css={styleMetadataField}>
        <button id="edit-plan-button" css={styleEditPlanButton}
          onClick={() => { goToEditPlan(planId); }}>
            Edit Plan
        </button>
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