import React from "react";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";

export default class ViewPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentName: "",
      onid: 0,
      planName: "",
      status: -1,

      courses: [[], [{
        courseId: 0,
        credits: 0,
        courseName: "",
        courseCode: "",
        prerequisites: ""
      }], []]
    };

    this.searchPlans = this.searchPlans.bind(this);
  }

  async searchPlans() {

    const value = document.getElementById("search-plans-input").value;
    const url = `/api/plan/${value}`;
    let obj = [];

    try {
      const results = await fetch(url);
      obj = await results.json();
      this.setState({
        courses: obj
      });
      this.setState({
        studentName: "Luke Skywalker"
      });
      this.setState({
        planName: obj[0][0].planName
      });
      this.setState({
        onid: obj[0][0].studentId
      });
      this.setState({
        status: parseInt(obj[0][0].status)
      });
    } catch (err) {
      alert(err);
    }

  }

  render() {
    return (
      <div className="view-plan">

        <PlanMetadata studentName={this.state.studentName} onid={this.state.onid}
          planName={this.state.planName} status={this.state.status} />

        <PlanTable courses={this.state.courses} />

        <div className="search-plans-container">
          <form className="search-plans-form">
            <input id="search-plans-input" type="text" placeholder="Search.." name="search"/>
          </form>
          <button id="search-plans-button" type="submit" onClick={this.searchPlans}>Get Plan</button>
        </div>

        <PlanComments />

      </div>
    );
  }
}