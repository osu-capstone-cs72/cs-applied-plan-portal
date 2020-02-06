import React from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";
import Navbar from "./Navbar";

export default class StudentCreatePlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      totalCredits: 0
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
        <Navbar showSearch={false} searchContent={null}/>
        <EditPlan courses={this.state.courses} remove={this.removeCourse}/>
        <CourseContainer updateCourses={this.updateCourses}/>
      </div>
    );
  }
}