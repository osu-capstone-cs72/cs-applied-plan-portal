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

    this.submitPlan = this.submitPlan.bind(this);
    this.loadCredits = this.loadCredits.bind(this);
  }

  submitPlan() {
    // get plan name from input field
    const planname = document.getElementById("plan-name-input").value;

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
          alert(res);
        });
      })
        .catch((error) => alert("Error: " + error));
    } catch (err) {
      // this is a server error
      alert("An internal server error occurred. Please try again later.");
    }
  }

  loadCredits() {
    // sum all the credits from the courses, return an int
    let totalCreds = 0;
    for (let i = 0; i < this.props.courses.length; i++) {
      totalCreds += this.props.courses[i].credits;
    }
    return totalCreds;
  }

  render() {
    return (
      <div className="edit-plan">
        <div className="header">
          <div className="plan-header">
            <label className="plan-name">Plan name</label>
            <input id="plan-name-input" type="text" placeholder="Enter plan name"></input>
          </div>
          <div className="credits-header">
            <label className="credits">Total credits</label>
            <p className="total-credits">{this.loadCredits()}</p>
          </div>
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