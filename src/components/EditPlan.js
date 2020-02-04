import React from "react";
import PlanCourse from "./PlanCourse";
import PropTypes from "prop-types";
import "../public/index.css";

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
  }

  submitPlan() {
    // const postRequest = new XMLHttpRequest();
    const postURL = "/api/plan";
    // postRequest.open("POST", postURL);
    const courses = [];
    for (let i = 0; i < this.props.courses.length; i++) {
      courses.push(this.props.courses[i].code);
    }

    const postObj = {
      userId: 1,
      planName: "examplePlan",
      courses: courses
    };

    fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postObj),
    }).then((data) => {
      alert("Success: " + data.status);
    })
      .catch((error) => alert("Error: " + error));
  }

  render() {
    return (
      <div className="edit-plan">
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