import React from "react";
import PlanCourse from "./PlanCourse";
import PropTypes from "prop-types";
import "../public/index.css";

export default class EditPlan extends React.Component {
  static get propTypes() {
    return {
      remove: PropTypes.func,
      courses: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="edit-plan">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Title</th>
              <th scope="col">Credits</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.courses.map(c => <PlanCourse key={c.code} code={c.code} title={c.title}
              credits={c.credits} remove={this.props.remove}/>)}
          </tbody>
        </table>
      </div>
    );
  }
}