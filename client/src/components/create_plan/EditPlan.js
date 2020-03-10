/** @jsx jsx */

import React from "react";
import PlanCourse from "./PlanCourse";
import PropTypes from "prop-types";
import {getToken} from "../../utils/authService";
import {css, jsx} from "@emotion/core";

export default class EditPlan extends React.Component {

  static get propTypes() {
    return {
      onRemoveCourse: PropTypes.func,
      courses: PropTypes.array,
      edit: PropTypes.number,
      planName: PropTypes.string,
      onChangePlanName: PropTypes.func,
      onLoading: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      warning: null,
    };

    this.submitPlan = this.submitPlan.bind(this);
    this.editPlan = this.editPlan.bind(this);
    this.loadCredits = this.loadCredits.bind(this);
    this.clearWarning = this.clearWarning.bind(this);
    this.validatePlan = this.validatePlan.bind(this);
    this.updatePlanName = this.updatePlanName.bind(this);
  }

  submitPlan() {
    // get plan name from input field
    const planname = document.getElementById("plan-name-input").value;
    if (this.validatePlan(planname)) {

      // create an array of strings containing course codes
      const courses = [];
      for (let i = 0; i < this.props.courses.length; i++) {
        courses.push(this.props.courses[i].courseCode);
      }

      // check to see if we should perform a POST request or a PATCH request
      if (this.props.edit) {
        this.editPlan(courses, planname, this.props.edit);
      } else {

        // set up data for new plan to send to backend
        const token = getToken();
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const postURL = `http://${server}/plan/?accessToken=${token}`;
        const postObj = {
          planName: planname,
          courses: courses
        };

        try {
          this.props.onLoading(true);
          fetch(postURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postObj),
          }).then((data) => {
            data.text().then(res => {
              if (data.status === 201) {
              // redirect to the view plan of newly submitted plan,else give the user a warning with backend error message
                window.location.href = `/viewPlan/${JSON.parse(res).insertId}`;
              } else {
                this.setState({
                  warning: JSON.parse(res).error
                });
              }
            });
          })
            .catch((error) => alert("Error: " + error));
        } catch (err) {
          // this is a server error
          alert("An internal server error occurred. Please try again later.");
        }
        this.props.onLoading(false);
      }
    }
  }

  editPlan(courses, planname, planId) {
    // set up data for new plan to send to backend
    const token = getToken();
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const patchURL = `http://${server}/plan/?accessToken=${token}`;
    const patchObj = {
      planId: planId,
      planName: planname,
      courses: courses
    };

    try {
      this.props.onLoading(true);
      fetch(patchURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patchObj),
      }).then((data) => {
        data.text().then(res => {
          if (data.status === 200) {
            // redirect to the view plan of updated plan
            window.location.href = `/viewPlan/${planId}`;
          } else {
            this.setState({
              warning: JSON.parse(res).error
            });
          }
        });
      })
        .catch((error) => alert("Error: " + error));
    } catch (err) {
      // this is a server error
      alert("An internal server error occurred. Please try again later.");
    }
    this.props.onLoading(false);
  }

  validatePlan(planname) {
    const NAME_MIN = 5;
    const NAME_MAX = 50;
    const CREDITS_MIN = 32;

    // check that plan name has a valid length
    if (planname.length < NAME_MIN || planname.length > NAME_MAX) {
      this.setState({
        warning: `Plan name must be between ${NAME_MIN} and ${NAME_MAX} characters.`
      });
      return false;
    }
    // check that the minimum amount of credits are selected
    const credits = this.loadCredits();
    if (credits < CREDITS_MIN) {
      this.setState({
        warning: `Plan must have at least ${CREDITS_MIN} credits.`
      });
      return false;
    }

    return true;
  }

  loadCredits() {
    // sum all the credits from the courses, return an int
    let totalCreds = 0;
    for (let i = 0; i < this.props.courses.length; i++) {
      totalCreds += this.props.courses[i].credits;
    }
    return totalCreds;
  }

  clearWarning() {
    this.setState({
      warning: null
    });
  }

  updatePlanName(e) {
    this.clearWarning();
    this.props.onChangePlanName(e.target.value);
  }

  render() {

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

      .credits-header {
        float: right;
        margin-right: 15px;
      }

      .credits {
        display: block;
      }

      .total-credits {
        position: relative;
        left: 50%;
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

    return (
      <div className="edit-plan" css={style}>
        <div className="header">
          <div className="plan-header">
            {/*<label className="plan-name">Plan name</label>*/}
            <input id="plan-name-input" type="text" placeholder={"Enter plan name"}
              value={this.props.planName} onChange={this.updatePlanName} />
          </div>
          <div className="credits-header">
            {/*<label className="credits">Total credits</label>*/}
            <p className="total-credits">{this.loadCredits()} credits</p>
          </div>
        </div>
        <div className="warning-box">
          {this.state.warning ? <p>{this.state.warning}</p> : null}
        </div>
        <table className="edit-plan-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Credits</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {this.props.courses.map(c => <PlanCourse key={c.courseId} courseId={c.courseId} courseCode={c.courseCode}
              courseName={c.courseName} credits={c.credits} onRemoveCourse={e => this.props.onRemoveCourse(e)}/>)}
          </tbody>
        </table>
        <div className="action-tray">
          <button className="submit-button" onClick={this.submitPlan}>
            {this.props.edit ? "Save Plan" : "Submit Plan"}
          </button>
        </div>
      </div>
    );
  }
}