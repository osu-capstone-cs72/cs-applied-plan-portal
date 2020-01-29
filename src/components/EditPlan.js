import React from "react";
import PlanCourse from "./PlanCourse";
import "../public/index.css";

export default class EditPlan extends React.Component {

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
            {this.props.courses.map(c => <PlanCourse code={c.code} title={c.title}
              credits={c.credits} remove={this.props.remove}/>)}
          </tbody>
        </table>
      </div>
    );
  }
}