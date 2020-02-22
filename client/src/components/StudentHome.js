import React from "react";
import NavBar from "./Navbar";
import {getToken, getProfile} from "../utils/authService";

export default class StudentHome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      plans: null
    };

    this.getAllPlans = this.getAllPlans.bind(this);
    this.renderStatus = this.renderStatus.bind(this);

    this.getAllPlans();
  }

  async getAllPlans() {
    const profile = getProfile();
    const token = getToken();
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const getUrl = `http://${server}/user/${profile.sub}/plans/` +
      `?accessToken=${token}`;
    console.log(getUrl);
    let obj = [];

    try {
      const results = await fetch(getUrl);
      if (results.ok) {
        obj = await results.json();
        this.setState({
          plans: obj
        });
      } else {
        // we got a bad status code
        try {
          throw results;
        } catch (err) {
          err.text().then(errorMessage => {
            alert("Error " + errorMessage);
          });
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  renderStatus(status) {
    switch (status) {
      case 0:
        return "Rejected";
      case 1:
        return "Awaiting student changes";
      case 2:
        return "Awaiting review";
      case 3:
        return "Awaiting final review";
      case 4:
        return "Accepted";
      default:
        return "Undefined status";
    }
  }

  goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  render() {
    return (
      <div>
        <NavBar />
        <table className="student-plans-table">
          <thead>
            <tr>
              <th className="student-plans-data">Name</th>
              <th className="student-plans-data">Status</th>
              <th className="student-plans-data">Updated</th>
              <th className="student-plans-data">Reviewers</th>
            </tr>
            {this.state.plans ? this.state.plans.map(p =>
              <tr key={p.planId + "a"} onClick={() => this.goToPlan(p)}>
                <td className="student-plans-data" key={p.planId + "b"}>{p.planName}</td>
                <td className="student-plans-data" key={p.planId + "c"}>{this.renderStatus(p.status)}</td>
                <td className="student-plans-data" key={p.planId + "d"}>{p.lastUpdated}</td>
              </tr>) : null}
          </thead>
        </table>
        <button className="new-plan-button" onClick={() => window.location.href = "/createPlan"}>+</button>
      </div>
    );
  }
}