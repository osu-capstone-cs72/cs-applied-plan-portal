import React from "react";
import NavBar from "./Navbar";
import PropTypes from "prop-types";


export default class StudentHome extends React.Component {
  static get propTypes() {
    return {
      userId: PropTypes.number
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      plans: null
    };

    this.getAllPlans = this.getAllPlans.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
  }

  componentWillMount() {
    this.getAllPlans();
  }

  async getAllPlans() {
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const getUrl = `http://${server}/plan/getAllPlans/${this.props.userId}`;
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
        <NavBar showSearch={true} searchContent={"Search for plans"}/>
        <table className="student-plans-table">
          <tr>
            <th className="student-plans-data">Name</th>
            <th className="student-plans-data">Status</th>
            <th className="student-plans-data">Updated</th>
            <th className="student-plans-data">Reviewers</th>
          </tr>
          {this.state.plans ? this.state.plans.map(p =>
            <tr key={this.props.userId} onClick={() => this.goToPlan(p)}>
              <td className="student-plans-data" key={this.props.userId}>{p.planName}</td>
              <td className="student-plans-data" key={this.props.userId}>{this.renderStatus(p.status)}</td>
              <td className="student-plans-data" key={this.props.userId}>{p.lastUpdated}</td>
            </tr>) : null}
        </table>
        <button className="new-plan-button" onClick={() => window.location.href = "/createPlan"}>+</button>
      </div>
    );
  }
}