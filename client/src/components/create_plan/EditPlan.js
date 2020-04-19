/** @jsx jsx */

import React from "react";
import EditPlanTable from "./EditPlanTable";
import ErrorMessage from "../general/ErrorMessage";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";
import {login} from "../../utils/authService";

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
      warning: "",
    };

    this.submitPlan = this.submitPlan.bind(this);
    this.editPlan = this.editPlan.bind(this);
    this.loadCredits = this.loadCredits.bind(this);
    this.clearWarning = this.clearWarning.bind(this);
    this.validatePlan = this.validatePlan.bind(this);
    this.updatePlanName = this.updatePlanName.bind(this);
  }

  async submitPlan() {
    // get plan name from input field
    const planName = document.getElementById("plan-name-input").value;
    if (this.validatePlan(planName)) {

      // create an array of strings containing course IDs
      const courses = [];
      for (let i = 0; i < this.props.courses.length; i++) {
        courses.push({
          courseId: this.props.courses[i].courseId,
          credits: this.props.courses[i].credits
        });
      }

      // check to see if we should perform a POST request or a PATCH request
      if (this.props.edit) {
        this.editPlan(courses, planName, this.props.edit);
      } else {

        // set up data for new plan to send to backend
        const postURL = `/api/plan`;
        const postObj = {
          planName: planName,
          courses: courses
        };

        try {
          this.props.onLoading(true);

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
            this.setState({
              warning: obj.error
            });
          }

        } catch (err) {
          // this is a server error
          this.setState({
            warning: "An internal server error occurred. Please try again later."
          });
        }
        this.props.onLoading(false);
      }
    }
  }

  async editPlan(courses, planName, planId) {
    // set up data for new plan to send to backend
    const patchURL = `/api/plan`;
    const patchObj = {
      planId: planId,
      planName: planName,
      courses: courses
    };

    try {
      this.props.onLoading(true);

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
        this.setState({
          warning: obj.error
        });
      }

    } catch (err) {
      // this is a server error
      this.setState({
        warning: "An internal server error occurred. Please try again later."
      });
    }
    this.props.onLoading(false);
  }

  validatePlan(planName) {
    const NAME_MIN = 5;
    const NAME_MAX = 50;
    const CREDITS_MIN = 32;

    // check that plan name has a valid length
    if (planName.length < NAME_MIN || planName.length > NAME_MAX) {
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
      totalCreds += parseInt(this.props.courses[i].credits, 10);
    }
    return totalCreds;
  }

  clearWarning() {
    this.setState({
      warning: ""
    });
  }

  updatePlanName(e) {
    this.clearWarning();
    this.props.onChangePlanName(e.target.value);
  }

  render() {

    const style = css`
      & {
        grid-area: plan;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 50px 1fr auto;
        grid-row-gap: 1rem;
        grid-template-areas: 'title'
                             'table'
                             'submit';
      }
      
      #title {
        grid-area: title;
        display: flex;
        align-items: stretch;
      }
      
      #title-input {
        font-size: x-large;
        padding: 0.5rem 1rem;
        font-family: 'Muli', sans-serif;
        font-weight: bold;
        border-radius: 0.5rem;
        border: 1.5px solid #dfdad8;
      }
      
      #title-credits {
        margin-left: auto;
        margin-right: 18px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        text-align: center;
        font-weight: bold;
      }
      
      #credits-count {
        font-size: 18px;
      }
      
      #credits-label {
        font-size: 14px;
      }
      
      #submit {
        grid-area: submit;
        text-align: right;
      }
      
      #submit-button {
        background: var(--color-blue-500);
        color: var(--color-blue-50);
        padding: 1rem 1rem;
        border-radius: 0.5rem;
        border: none;
      }
    `;

    return (
      <div id="edit-container" css={style}>
        <div id="title">
          <input id="title-input"
            type="text"
            placeholder={"Enter plan name"}
            value={this.props.planName}
            onChange={this.updatePlanName}
          />
          <div id="title-credits">
            <div id="credits-count">{this.loadCredits()}</div>
            <div id="credits-label">credits</div>
          </div>
        </div>
        {/*<ErrorMessage text={this.state.warning} className="error-hide-conditional"/>*/}
        { this.props.courses.length > 0
          ? <EditPlanTable
              courses={this.props.courses}
              onRemoveCourse={this.props.onRemoveCourse}
            />
          : <div className="no-courses-msg">
              <h2 className="empty-plan-title">No courses!</h2>
              <h4 className="empty-plan-description">Use the search bar to find courses and add them to your plan.</h4>
          </div>
        }
        <div id="submit">
          <button id="submit-button"onClick={this.submitPlan}>
            {this.props.edit ? "Save Plan" : "Submit Plan"}
          </button>
        </div>
      </div>
    );
  }
}