import React from "react";
import PropTypes from "prop-types";

export default class PlanTable extends React.Component {
  static get propTypes() {
    return {
      courses: PropTypes.any
    };
  }

  render() {
    return (
      <div className="table-container">
        <table className="courses-table">
          <tbody>
            <tr>
              <th>Course</th>
              <th>Name</th>
              <th>Credit Hours</th>
              <th>Prerequisites</th>
            </tr>
            {this.props.courses[1].map((course) => (
              <tr key={course.courseId}>
                <td key={course.courseId + "a"}>{course.courseCode}</td>
                <td key={course.courseId + "b"}>{course.courseName}</td>
                <td key={course.courseId + "c"}>{course.credits}</td>
                <td key={course.courseId + "d"}>{course.prerequisites}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

}