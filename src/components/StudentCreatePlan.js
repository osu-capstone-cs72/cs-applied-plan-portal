import React from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";

export default class StudentCreatePlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      totalCredits: 0
    };

    this.updateCourses = this.updateCourses.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
    this.loadCredits = this.loadCredits.bind(this);
  }

  updateCourses(newCourses) {
    this.setState({
      courses: newCourses
    });
    this.loadCredits();
  }

  removeCourse(course) {
    const newCourses = this.state.courses;
    for (let i = 0; i < newCourses.length; i++) {
      if (newCourses[i].code === course.code) {
        newCourses.splice(i, 1);
      }
    }
    this.setState({
      courses: newCourses
    });

    this.loadCredits();
  }

  loadCredits() {
    let totalCreds = 0;
    for (let i = 0; i < this.state.courses.length; i++) {
      totalCreds += this.state.courses[i].credits;
    }
    this.setState({
      totalCredits: totalCreds
    });
  }

  render() {
    return (
      <div className="student-create-plan">
        <EditPlan courses={this.state.courses} remove={this.removeCourse} totalCredits={this.state.totalCredits}/>
        <CourseContainer updateCourses={this.updateCourses}/>
      </div>
    );
  }
}