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
        commentId: 0,
        userId: 0,
        time: null,
        text: ""
      }]
    };

    this.searchPlans = this.searchPlans.bind(this);
  }

  async searchPlans() {

    try {
      const value = document.getElementById("search-plans-input").value;
      let url = `/api/plan/${value}`;
      let obj = [];

      // get plan data
      let response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
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
      } else {
        // we got a bad status code
        try {
          throw response;
        } catch (err) {
          err.text().then(err => {
            alert(err);
          });
        }
      }

      // get plan comments
      url = `/api/plan/${value}/comment`;
      response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        this.setState({
          comments: obj
        });
      } else {
        // we got a bad status code
        try {
          throw response;
        } catch (err) {
          err.text().then(errorMessage => {
            alert(errorMessage);
          });
        }
      }

    } catch (err) {
      // this is a server error
      alert("An internal server error occurred. Please try again later.");
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