import React from "react";
import PropTypes from "prop-types";
export default class PlanCourse extends React.Component {
  static get propTypes() {
    return {
      code: PropTypes.any,
      title: PropTypes.any,
      credits: PropTypes.any,
      remove: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.removeButton = this.removeButton.bind(this);
  }

  removeButton() {
    this.props.remove(this.props);
  }

  render() {
    return (
      <tr>
        <th scope="row">{this.props.code}</th>
        <td>{this.props.title}</td>
        <td>{this.props.credits}</td>
        <td onClick={this.removeButton}>X</td>
      </tr>
    );
  }
}