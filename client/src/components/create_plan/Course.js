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
      credits: PropTypes.string,
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
      margin-bottom: 1rem;
      background: var(--color-lightgray-50);
      padding: 1rem;
      border-radius: 0.5rem;
      
      .add-button {
        display: inline-block;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem 1rem;
        background: var(--color-green-500);
        color: var(--color-green-50);
        border-radius: 0.5rem;
        border: none;
      }

      details summary {
        cursor: pointer;
        height: unset;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        user-select: none;
      }

      .add-button {
        margin-right: 0;
        margin-left: auto;
      }
      
      .disabled {
        background: var(--color-lightgray-700);
        color: var(--color-gray-50);
        cursor: default;
      }

      .course-title {
        font-weight: 600;
      }
      
      .course-title {
        display: inline-block;
        vertical-align: bottom;
      }

      .course-code {
        color: var(--color-gray-400);
        font-weight: normal;
      }

      summary+p {
        margin-top: 1rem;
      }

      p:last-child {
        margin-bottom: 0;
      }
    `;

    return (
      <div className="course" css={style}>
        <details>
          <summary>
            <div className="course-title">{this.props.courseName}
              <div className="course-code">
                <small>
                  {this.props.courseCode.replace(/([A-z])(\d)/, "$1 $2")}
                </small>
              </div>
            </div>
            <button className={`add-button ${this.props.restriction > 0 ? "disabled" : ""}`} onClick={this.addButton}>Add to plan</button>
          </summary>
          <h4>{this.props.credits} credit hour{this.props.credits !== 1 && "s"}{this.props.prerequisites === "" && ", no prerequisites"}</h4>
          { this.props.description !== "" &&
            <div>
              <br></br>
              <h4>Description</h4>
              <p>{this.props.description}</p>
            </div>
          }
          { this.props.prerequisites !== "" &&
            <div>
              <br></br>
              <h4>Registration Restrictions</h4>
              <p>{this.props.prerequisites}</p>
            </div>
          }
        </details>
      </div>
    );
  }
}