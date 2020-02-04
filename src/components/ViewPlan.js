import React from "react";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";

export default class ViewPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentName: "Luke",
      onid: "1",
      planName: "My Plan",
      status: 2
    };
  }

  render() {
    return (
      <div className="view-plan">
        <PlanMetadata studentName={this.state.studentName} onid={this.state.onid} planName={this.state.planName} status={this.state.status} />
        <PlanTable />
        <PlanComments />
      </div>
    );
  }
}