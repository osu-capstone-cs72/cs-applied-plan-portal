/** @jsx jsx */

import React from "react";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";

export default class PlanCourse extends React.Component {
  static get propTypes() {
    return {
      courseId: PropTypes.number,
      courseCode: PropTypes.string,
      courseName: PropTypes.string,
      credits: PropTypes.any,
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

    const style = css`
      
      .remove-button {
        display: inline-block;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem 1rem;
        background: var(--color-red-500);
        color: var(--color-red-50);
        border-radius: 0.5rem;
        border: none;
      }
      
      .table-item-title {
        font-weight: 600;
      }

      .table-item-subtitle {
        font-weight: normal;
        color: var(--color-gray-400);
      }

    `;

    return (
      <tr css={style}>
        <td>
          <div className="table-item-title">{this.props.courseName}</div>
          <div className="table-item-subtitle"><small>{this.props.courseCode.replace(/([A-z])(\d)/, "$1 $2")}</small></div>
        </td>
        <td>{this.props.credits}</td>
        <td><button className="remove-button" onClick={this.removeButton}>Remove</button></td>
      </tr>
    );
  }
}