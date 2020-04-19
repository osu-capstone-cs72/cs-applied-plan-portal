/** @jsx jsx */

import {useState} from "react";
import PlanCourse from "./PlanCourse";
import ErrorMessage from "../general/ErrorMessage";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";
import {login} from "../../utils/authService";

function EditPlan(props) {

  const [warning, setWarning] = useState("");

  const style = css`
    flex: 80%;
    margin: 15px;
    margin-top: 65px;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    
    .action-tray {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }
    
    .submit-button {
    }

    .plan-header {
      display: inline;
    }

    .plan-name {
      padding: 5px;
    }

    .credits {
    }
    
    .credits-label {
      font-size: 14px;
      margin-top: -5px;
      margin-bottom: 5px;
    }
    
    .credits-header {
      display: flex;
      align-items: space-around;
      justify-content: center;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      margin-left: auto;
      flex-direction: column;
      margin-right: 1rem;
    }

    #plan-name-input {
      font-size: 23px;
      border-radius: 0.5rem;
      border: 2px solid var(--color-lightgray-500);
      /*background: var(--color-lightgray-300);*/
      color: var(--color-gray-800);
      padding: 0.5rem 1rem;
      font-weight: 500;
      margin-bottom: 1rem;
      outline: none;
    }
    
    .header {
      display: flex;
      flex-direction: row;
    }
    
    .edit-plan-table {
      flex: 100%;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }
    
    table.edit-plan-table thead tr th {
      background: var(--color-lightgray-100);
      color: var(--color-gray-400);
      font-variant-caps: all-small-caps;
      font-weight: 600;
      font-size: 12pt;
      border-bottom: none;
      padding: 1rem 2rem;
      /*padding: 10px;*/
    }
    
    table.edit-plan-table tbody tr td {
      vertical-align: middle;
      padding: 1rem 2rem;
    }
    
    .submit-button {
      background: var(--color-blue-500);
      color: var(--color-blue-50);
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
    }
  `;

  // create a new plan by submitting a set of courses and a plan name
  async function submitPlan() {
    // get plan name from input field
    const planName = document.getElementById("plan-name-input").value;
    if (validatePlan(planName)) {

      // create an array of strings containing course IDs
      const courses = [];
      for (let i = 0; i < props.courses.length; i++) {
        courses.push({
          courseId: props.courses[i].courseId,
          credits: props.courses[i].credits
        });
      }

      // check to see if we should perform a POST request or a PATCH request
      if (props.edit) {
        editPlan(courses, planName, props.edit);
      } else {

        // set up data for new plan to send to backend
        const postURL = `/api/plan`;
        const postObj = {
          planName: planName,
          courses: courses
        };

        try {
          props.onLoading(true);

          const results = await fetch(postURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postObj)
          });

          if (results.ok) {
            // redirect to the view plan of the newly submitted plan,
            // else give the user a warning with backend error message
            const obj = await results.json();
            window.location.href = `/viewPlan/${obj.insertId}`;
          } else if (results.status === 403) {
            // if the user is not allowed to create a plan,
            // redirect to login to allow updating of user info
            login();
          } else {
            const obj = await results.json();
            setWarning(obj.error);
          }

        } catch (err) {
          // this is a server error
          setWarning("An internal server error occurred. Please try again later.");
        }
        props.onLoading(false);
      }
    }
  }

  // update a plan by submitting a different set of courses and/or plan name
  async function editPlan(courses, planName, planId) {
    // set up data for new plan to send to backend
    const patchURL = `/api/plan`;
    const patchObj = {
      planId: planId,
      planName: planName,
      courses: courses
    };

    try {
      props.onLoading(true);

      const results = await fetch(patchURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patchObj)
      });

      if (results.ok) {
        // redirect to the view plan of updated plan
        window.location.href = `/viewPlan/${planId}`;
      } else {
        const obj = await results.json();
        setWarning(obj.error);
      }

    } catch (err) {
      // this is a server error
      setWarning("An internal server error occurred. Please try again later.");
    }
    props.onLoading(false);
  }

  function validatePlan(planName) {
    const NAME_MIN = 5;
    const NAME_MAX = 50;
    const CREDITS_MIN = 32;

    // check that plan name has a valid length
    if (planName.length < NAME_MIN || planName.length > NAME_MAX) {
      setWarning(`Plan name must be between ${NAME_MIN} and ${NAME_MAX} characters.`);
      return false;
    }
    // check that the minimum amount of credits are selected
    const credits = loadCredits();
    if (credits < CREDITS_MIN) {
      setWarning(`Plan must have at least ${CREDITS_MIN} credits.`);
      return false;
    }

    return true;
  }

  // sum all the credits from the courses, return an int
  function loadCredits() {
    let totalCredits = 0;
    for (let i = 0; i < props.courses.length; i++) {
      totalCredits += parseInt(props.courses[i].credits, 10);
    }
    return totalCredits;
  }

  // update the value of the plan name when the field is changed
  function updatePlanName(e) {
    setWarning("");
    props.onChangePlanName(e.target.value);
  }


  return (
    <div className="edit-plan" css={style}>
      <div className="header">
        <div className="plan-header">
          {/* <label className="plan-name">Plan name</label> */}
          <input id="plan-name-input" type="text" placeholder={"Enter plan name"}
            value={props.planName} onChange={updatePlanName} />
        </div>
        <div className="credits-header">
          {/* <label className="credits">Total credits</label> */}
          <div className="credits">{loadCredits()}</div>
          <div className="credits-label">credits</div>
        </div>
      </div>
      <ErrorMessage text={warning} className="error-hide-conditional"/>
      {props.courses.length > 0 ?
        <div className="table-container">
          <table className="edit-plan-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Credits</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {props.courses.map(c => <PlanCourse key={c.courseId} courseId={c.courseId} courseCode={c.courseCode}
                courseName={c.courseName} credits={c.credits} onRemoveCourse={e => props.onRemoveCourse(e)}/>)}
            </tbody>
          </table>
          <div className="action-tray">
            <button className="submit-button" onClick={submitPlan}>
              {props.edit ? "Save Plan" : "Submit Plan"}
            </button>
          </div>
        </div>
        : <div className="no-courses-msg">
          <h2 className="empty-plan-title">No courses!</h2>
          <h4 className="empty-plan-description">Use the search bar to find courses and add them to your plan.</h4>
        </div>}
    </div>
  );
}
export default EditPlan;

EditPlan.propTypes = {
  onRemoveCourse: PropTypes.func,
  courses: PropTypes.array,
  edit: PropTypes.number,
  planName: PropTypes.string,
  onChangePlanName: PropTypes.func,
  onLoading: PropTypes.func
};