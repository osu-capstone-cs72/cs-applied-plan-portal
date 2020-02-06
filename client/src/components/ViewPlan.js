import React from "react";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";
import {withRouter} from 'react-router-dom';

class ViewPlan extends React.Component {
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

      let userId = 0;
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      let url = `http://${server}/plan/${value}`;
      let obj = [];

      try {
        // get plan data
        let response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          userId = obj[0][0].studentId;
          this.setState({
            courses: obj
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
          // we got a bad status code. send to 404 page
          const { history } = this.props;
          if(history) history.push('/404');
          return;
        }
      } catch (err) {
        // send to 500 page if a server error happens while fetching plan
        console.log("An internal server error occurred. Please try again later.");
        const { history } = this.props;
        if(history) history.push('/500');
        return;
      }

      // get user name
      url = `http://${server}/user/${userId}`;
      let response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        this.setState({
          studentName: obj.firstName + " " + obj.lastName
        });
      }

      // get plan comments
      url = `http://${server}/plan/${value}/comment`;
      response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        this.setState({
          comments: obj
        });
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
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
export default withRouter(ViewPlan);