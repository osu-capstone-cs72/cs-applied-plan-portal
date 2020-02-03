import React from "react";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";

export default class ViewPlan extends React.Component {

  render() {
    return (
      <div className="view-plan">
        <PlanMetadata />
        <PlanTable />
        <PlanComments />
      </div>
    );
  }

}