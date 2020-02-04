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
          </tbody>
        </table>
      </div>
    );
  }

}