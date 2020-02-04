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
    // this.loadCredits = this.loadCredits.bind(this);
    // this.removeCourse = this.removeCourse.bind(this);
  }

  submitPlan() {
    const courses = [];
    for (let i = 0; i < this.props.courses.length; i++) {
      courses.push(this.props.courses[i].code);
    }

    const postURL = "/api/plan";
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

  // loadCredits() {
  //   let totalCreds = 0;
  //   for (let i = 0; i < this.state.courses.length; i++) {
  //     totalCreds += this.state.courses[i].credits;
  //   }
  //   this.setState({
  //     totalCredits: totalCreds
  //   });
  // }

  // removeCourse(course) {
  //   const newCourses = this.state.courses;
  //   for (let i = 0; i < newCourses.length; i++) {
  //     if (newCourses[i].code === course.code) {
  //       newCourses.splice(i, 1);
  //     }
  //   }
  //   this.setState({
  //     courses: newCourses
  //   });
  //   this.loadCredits();
  // }

  render() {
    return (
      <div className="edit-plan">
        <div className="header">
          <div className="plan-header">
            <label className="plan-name">Plan name</label>
            <input type="text" placeholder="Enter plan name"></input>
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