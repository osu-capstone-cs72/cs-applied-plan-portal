import React from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";

export default class StudentCreatePlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: []
    };

    this.updateCourses = this.updateCourses.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
  }

  updateCourses(newCourses) {
    this.setState({
      courses: newCourses
    });
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
  }

  render() {
    return (
      <div className="student-create-plan">
        <EditPlan courses={this.state.courses} remove={this.removeCourse}/>
        <CourseContainer updateCourses={this.updateCourses}/>
      </div>
    );
  }
}