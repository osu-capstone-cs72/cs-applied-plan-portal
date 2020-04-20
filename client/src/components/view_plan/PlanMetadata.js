/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {statusText} from "../../utils/renderStatus";
import {Link, useParams, withRouter} from "react-router-dom";
import {useState, useEffect} from "react";
import PropTypes from "prop-types";

function PlanMetadata(props) {

  const {planId} = useParams();
  const [creditSum, setCreditSum] = useState(0);

  const style = css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;

    .plan-metadata {
      padding: 10px;
      text-align: center;
      width: 100%;
      background: #f4f2f1;
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

    #delete-plan-button, #edit-plan-button, #print-plan-button {
      padding: 10px;
    }

    /*#modify-button-container {
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      margin: 0;
    }*/
    
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

      .button-field, #edit-plan-link, #delete-plan-button, #edit-plan-button,
        #print-plan-button, #modify-button-container {
        display: none;
      }

      .metadata-field {
        display: inline-block;
        word-wrap: break-word;
      }

    }
  `;

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < props.courses.length; i++) {
      sum += parseInt(props.courses[i].credits, 10);
    }
    setCreditSum(sum);
  }, [props.courses]);

  return (
    <div id="metadata-container" css={style}>
      <div className="plan-metadata">
        <div className="metadata-field" id="plan-field">
          <p className="field-type">Plan Name:</p>
          <p className="field-text">{props.planName}</p>
        </div>
        <div className="metadata-field" id="student-field">
          <p className="field-type">Student Name:</p>
          <p className="field-text">{props.studentName}</p>
        </div>
        <div className="metadata-field" id="email-field">
          <p className="field-type">Email:</p>
          <p className="field-text">{props.email}</p>
        </div>
        <div className="metadata-field" id="credit-field">
          <p className="field-type">Total Credits:</p>
          <p className="field-text">{creditSum}</p>
        </div>
        <div className="metadata-field" id="status-field">
          <p className="field-type">Plan Status:</p>
          <p className="field-text">{statusText(props.status)}</p>
        </div>
        <div className="metadata-field button-field">
          <button id="print-plan-button" onClick={() => props.onPrint()}>
            Print Plan
          </button>
        </div>
        {props.status === 1 || props.status === 2 ? (
          <div className="metadata-field button-field">
            <Link to={`/editPlan/${planId}`} id="edit-plan-link">
              <button id="edit-plan-button">
                Edit Plan
              </button>
            </Link>
          </div>
        ) : (null)}
        {props.status === 1 || props.status === 2 ? (
          <div className="metadata-field button-field">
            <button id="delete-plan-button" onClick={() => props.onDelete()}>
              Delete Plan
            </button>
          </div>
        ) : (null)}
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
  courses: PropTypes.array
};