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
                <td key={course.courseId}>{course.courseCode}</td>
                <td key={course.courseId}>{course.courseName}</td>
                <td key={course.courseId}>{course.credits}</td>
                <td key={course.courseId}>{course.prerequisites}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

}