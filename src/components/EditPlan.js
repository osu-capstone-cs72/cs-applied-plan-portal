import React from "react";
import PlanCourse from "./PlanCourse";
import PropTypes from "prop-types";
import "../public/index.css";

export default class EditPlan extends React.Component {
  static get propTypes() {
    return {
      remove: PropTypes.func,
      courses: PropTypes.any,
      totalCredits: PropTypes.number
    };
  }

  constructor(props) {
    super(props);

    this.submitPlan = this.submitPlan.bind(this);
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
    const postURL = "/api/plan";
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
            <p className="total-credits">{this.props.totalCredits}</p>
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