/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { statusText } from "../../../utils/renderStatus";
import { Link, useParams, withRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EditPlanBtn from "./EditPlanBtn";
import DeletePlanBtn from "./DeletePlanBtn";
import { Desktop, Mobile } from "../../../utils/responsiveUI";
import React from "react";
import { MOBILE_WIDTH } from "../../../utils/constants";
import { BOX_SHADOW_CARD } from "../../../utils/constants";
// header bar that shows metadata about current plan
function PlanMetadata(props) {
  const { planId } = useParams();
  const [creditSum, setCreditSum] = useState(0);

  const responSize = "max-width: 860px";

  const style = css`
    & {
      display: flex;
      justify-content: center;
      flex-direction: column;
      /* position: fixed; */
      /* top: 50px; */
      /* left: 0; */
      /* right: 0; */
      background: white;
      /* box-shadow: ${BOX_SHADOW_CARD}; */
      padding-bottom: 0.5rem;
    }

    .plan-buttons {
      display: flex;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      width: 100%;
    }

    .plan-buttons .button-field {
      max-width: 120px;
    }

    .plan-metadata {
      padding: 10px;
      text-align: center;
      width: 100%;
      display: flex;
      align-items: stretch;
      justify-content: center;
      flex-direction: row;
    }

    .metadata-field {
      /*vertical-align: top;
      display: inline-block;*/
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 55px;
      word-wrap: break-word;
      flex-grow: 1;
    }

    .small-metadata-field {
      vertical-align: top;
      display: inline-block;
      width: 50%;
      height: 55px;
      word-wrap: break-word;
    }

    .field-type {
      font-weight: bold;
      vertical-align: middle;
    }

    .field-text {
      font-weight: normal;
      vertical-align: middle;
      margin-bottom: 0;
    }

    #delete-plan-button,
    #edit-plan-button,
    #print-plan-button {
      padding: 10px;
    }

    #plan-metadata-mobile-advisor {
      width: 90%;
      background-color: white;
      margin: auto;
      box-shadow: ${BOX_SHADOW_CARD};
      border-radius: 4px;
      padding: 1rem 2rem;
      margin-top: 1rem;

      .mobile-item-title {
        font-weight: 600;
      }
    }

    button {
      border: 1px solid black;
      color: black;
      border-radius: 0.25rem;
      background: transparent;
      margin-right: 0.5rem;
    }

    button:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    @media print {
      & {
        position: static;
        top: 0;
      }

      .button-field,
      #edit-plan-link,
      #delete-plan-button,
      #edit-plan-button,
      #print-plan-button,
      #modify-button-container {
        display: none;
      }

      .metadata-field {
        display: inline-block;
        word-wrap: break-word;
      }
    }

    @media screen and (max-width: 600px) {
      .field-type {
        font-size: 12px;
      }

      .field-text {
        font-size: 12px;
      }
    }

    @media (${responSize}) {
      top: 75px;
    }
  `;

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < props.courses.length; i++) {
      sum += parseInt(props.courses[i].credits, 10);
    }
    setCreditSum(sum);
  }, [props.courses]);

  const PlanMetadataGeneral = () => {
    return (
      <div className="plan-metadata">
        <div className="metadata-field" id="plan-field">
          <p className="field-type">Plan Name:</p>
          <p className="field-text">{props.planName}</p>
        </div>
        {props.currentUser.role !== 0 ? (
          <div className="metadata-field" id="student-field">
            <p className="field-type">Student Name:</p>
            <p className="field-text">{props.studentName}</p>
          </div>
        ) : null}
        {props.currentUser.role !== 0 ? (
          <div className="metadata-field" id="email-field">
            <p className="field-type">Email:</p>
            <p className="field-text">{props.email}</p>
          </div>
        ) : null}
        <div className="metadata-field" id="credit-field">
          <p className="field-type">Total Credits:</p>
          <p className="field-text">{creditSum}</p>
        </div>
        <div className="metadata-field" id="status-field">
          <p className="field-type">Plan Status:</p>
          <p className="field-text">{statusText(props.status)}</p>
        </div>
      </div>
    );
  };

  const PlanMetadataAdvisor = () => {
    return (
      <React.Fragment>
        <Desktop>
          <PlanMetadataGeneral />
        </Desktop>
        <Mobile>
          <div id="plan-metadata-mobile-advisor">
            <div className="metadata-mobile-item">
              <span className="mobile-item-title">Plan Name: </span>
              {props.planName}
            </div>
            <div className="metadata-mobile-item">
              <span className="mobile-item-title">Student Name: </span>{" "}
              {props.studentName}
            </div>
            <div className="metadata-mobile-item">
              <span className="mobile-item-title">Email: </span> {props.email}
            </div>
            <div className="metadata-mobile-item">
              <span className="mobile-item-title">Total Credits: </span>{" "}
              {creditSum}
            </div>
            <div className="metadata-mobile-item">
              <span className="mobile-item-title">Plan Status: </span>{" "}
              {statusText(props.status)}
            </div>
          </div>
        </Mobile>
      </React.Fragment>
    );
  };

  return (
    <div id="metadata-container" css={style}>
      {/* If user is student, show general metadata */}
      {/* else If user is advisor, show advisor metadata */}

      {props.currentUser.role === 0 ? (
        <PlanMetadataGeneral />
      ) : (
        <PlanMetadataAdvisor />
      )}

      <div className="plan-buttons">
        <EditPlanBtn status={props.status} planId={planId} />
        <DeletePlanBtn status={props.status} onDelete={props.onDelete} />
      </div>
    </div>
  );
}
export default withRouter(PlanMetadata);

PlanMetadata.propTypes = {
  studentName: PropTypes.string,
  userId: PropTypes.number,
  email: PropTypes.string,
  planName: PropTypes.string,
  status: PropTypes.number,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  onPrint: PropTypes.func,
  onDelete: PropTypes.func,
  courses: PropTypes.array,
};
