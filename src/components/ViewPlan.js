import React from "react";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";

export default class ViewPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentName: "",
      onid: null,
      planName: "",
      status: -1,

      courses: [[], [{
        courseId: 0,
        credits: null,
        courseName: "",
        courseCode: "",
        prerequisites: ""
      }], []],

      comments: [{
        commentId: 1,
        userId: 5,
        time: Date.now(),
        text: "This is the comment"
      }]
    };

    this.searchPlans = this.searchPlans.bind(this);
  }

  async searchPlans() {

    const value = document.getElementById("search-plans-input").value;
    let url = `/api/plan/${value}`;
    let obj = [];

    // get plan data
    try {
      const results = await fetch(url);
      if (!results.ok) {
        throw results;
      } else {
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
      }
    } catch (err) {
      err.text().then(errorMessage => {
        alert(errorMessage);
      });
    }

    // get plan comments
    url = `/api/plan/${value}/comment`;
    try {
      const results = await fetch(url);
      if (!results.ok) {
        throw results;
      } else {
        obj = await results.json();
        this.setState({
          courses: obj
        });
      }
    } catch (err) {
      err.text().then(errorMessage => {
        alert(errorMessage);
      });
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

        <PlanComments comments={this.state.comments} />

      </div>
    );
  }
}