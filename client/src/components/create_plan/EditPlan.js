import React from "react";
import PlanCourse from "./PlanCourse";
import PropTypes from "prop-types";

export default class EditPlan extends React.Component {
  static get propTypes() {
    return {
      remove: PropTypes.func,
      courses: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      warning: null
    };

    this.submitPlan = this.submitPlan.bind(this);
    this.loadCredits = this.loadCredits.bind(this);
    this.clearWarning = this.clearWarning.bind(this);
    this.validatePlan = this.validatePlan.bind(this);
  }

  submitPlan() {
    // get plan name from input field
    const planname = document.getElementById("plan-name-input").value;
    if (this.validatePlan(planname)) {

      // create an array of strings containing course codes
      const courses = [];
      for (let i = 0; i < this.props.courses.length; i++) {
        courses.push(this.props.courses[i].code);
      }

      // set up data for new plan to send to backend
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const postURL = `http://${server}/plan`;
      const postObj = {
        userId: 1,
        planName: planname,
        courses: courses
      };

      try {
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
    }
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

  render() {
    return (
      <div className="edit-plan">
        <div className="header">
          <div className="plan-header">
            <label className="plan-name">Plan name</label>
            <input id="plan-name-input" type="text" placeholder="Enter plan name" onChange={this.clearWarning}></input>
          </div>
          <div className="credits-header">
            <label className="credits">Total credits</label>
            <p className="total-credits">{this.loadCredits()}</p>
          </div>
        </div>
        <div className="warning-box">
          {this.state.warning ? <p>{this.state.warning}</p> : null}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Title</th>
              <th scope="col">Credits</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.courses.map(c => <PlanCourse key={c.code} code={c.code} title={c.title}
              credits={c.credits} remove={this.props.remove}/>)}
          </tbody>
        </table>
        <button className="submit-button" onClick={this.submitPlan}>Submit</button>
      </div>
    );
  }
}