/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {renderStatus} from "../../utils/renderStatus";
import {Link, useParams, withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function PlanMetadata(props) {

  const {planId} = useParams();

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
      background-color: #c0c0c0;
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

    @media print {

      .button-field, #edit-plan-link, #delete-plan-button, #edit-plan-button,
        #print-plan-button, #modify-button-container {
        display: none;
      }

      .metadata-field {
        width: 20%;
        word-wrap: break-word;
      }

    }
  `;

  return (
    <div id="metadata-container" css={style}>
      <div className="plan-metadata">
        <div className="metadata-field">
          <p className="field-type">Plan Name:</p>
          <p className="field-text">{props.planName}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Student Name:</p>
          <p className="field-text">{props.studentName}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Email:</p>
          <p className="field-text">{props.email}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">User ID:</p>
          <p className="field-text">{props.userId}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Plan Status:</p>
          <p className="field-text">{renderStatus(props.status)}</p>
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
  onDelete: PropTypes.func
};