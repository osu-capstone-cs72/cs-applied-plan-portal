import React from "react";
import PropTypes from "prop-types";

export default class PlanCourse extends React.Component {
  static get propTypes() {
    return {
      courseId: PropTypes.number,
      courseCode: PropTypes.string,
      courseName: PropTypes.string,
      credits: PropTypes.number,
      onRemoveCourse: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.removeButton = this.removeButton.bind(this);
  }

  removeButton() {
    this.props.onRemoveCourse({
      courseId: this.props.courseId
    });
  }

  render() {
    return (
      <tr>
        <th scope="row">{this.props.courseCode}</th>
        <td>{this.props.courseName}</td>
        <td>{this.props.credits}</td>
        <td onClick={this.removeButton}>X</td>
      </tr>
    );
  }
}