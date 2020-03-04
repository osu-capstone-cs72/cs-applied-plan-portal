/** @jsx jsx */

import React from "react";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";

export default class Course extends React.Component {
  static get propTypes() {
    return {
      courseId: PropTypes.number,
      courseCode: PropTypes.string,
      courseName: PropTypes.string,
      credits: PropTypes.number,
      description: PropTypes.string,
      prerequisites: PropTypes.string,
      restriction: PropTypes.number,
      onAddCourse: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      full: false
    };

    this.arrowButton = this.arrowButton.bind(this);
    this.addButton = this.addButton.bind(this);
  }

  arrowButton() {
    this.setState({
      full: !this.state.full
    });
  }

  addButton() {
    // lift up the state
    this.props.onAddCourse({
      courseId: this.props.courseId,
      courseCode: this.props.courseCode,
      courseName: this.props.courseName,
      credits: this.props.credits,
      description: this.props.description,
      prerequisites: this.props.prerequisites,
      restriction: this.props.restriction
    });
  }

  render() {

    const style = css`

      border: 1px solid black;
      margin-bottom: 15px;
      padding: 10px;
      background-color: #f2f2f2;

      .btn.btn-add {
        background-color: #b3b3b3;
      }

      .expand-btn {
        float: right;
      }

    `;

    return (
      <div className="course" css={style}>
        <p>{this.props.courseCode} - {this.props.courseName}</p>
        {this.state.full && <p>Credit hours: {this.props.credits}</p>}
        {this.state.full && <p>{this.props.description}</p>}
        {this.state.full && <p>Prerequisites: {this.props.prerequisites}</p>}
        <div className="course-btn-container">
          <button className="btn btn-add" onClick={this.addButton}>+ Add to plan</button>
          {this.state.full ? <button className="expand-btn" onClick={this.arrowButton}><i className="fad fa-angle-double-up"></i>-</button>
            : <button className="expand-btn" onClick={this.arrowButton}><i className="fad fa-angle-double-down"></i>+</button>}
        </div>
      </div>
    );
  }
}