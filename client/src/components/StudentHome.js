/** @jsx jsx */

import React from "react";
import NavBar from "./Navbar";
import {getToken, getProfile} from "../utils/authService";
import {formatTime} from "../utils/formatTime";
import PageSpinner from "./general/PageSpinner";
import PageInternalError from "./general/PageInternalError";
import {renderStatus} from "../utils/renderStatus";

import {css, jsx} from "@emotion/core";

export default class StudentHome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pageError: 0,
      plans: null,
      loading: true
    };

    this.getAllPlans = this.getAllPlans.bind(this);
    this.getAllPlans = this.getAllPlans.bind(this);
  }

  componentDidMount() {
    this.getAllPlans();
  }

  async getAllPlans() {

    this.setState({
      loading: true
    });
    const profile = getProfile();
    const token = getToken();
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const getUrl = `http://${server}/user/${profile.sub}/plans/` +
      `?accessToken=${token}`;

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
        if (results.status === 500) {
          this.setState({
            pageError: 500
          });
        }
        this.setState({
          loading: false
        });
        return;
      }
    } catch (err) {
      this.setState({
        pageError: 500
      });
    }
    this.setState({
      loading: false
    });
  }

  goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  render() {

    const style = css`

      .student-plans-table {
        margin: 0 auto;
        position: relative;
        top: 50px;
      }

      .student-plans-data {
        padding: 10px;
      }

      .new-plan-button {
        position: absolute;
        bottom: 55px;
        right: 30px;
      }

    `;

    if (!this.state.pageError) {
      return (
        <div css={style}>
          <PageSpinner loading={this.state.loading} />
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
                  <td className="student-plans-data" key={p.planId + "c"}>{renderStatus(p.status)}</td>
                  <td className="student-plans-data" key={p.planId + "d"}>{formatTime(p.lastUpdated)}</td>
                </tr>) : null}
            </thead>
          </table>
          <button className="new-plan-button" onClick={() => window.location.href = "/createPlan"}>+</button>
        </div>
      );
    } else {
      return <PageInternalError />;
    }
  }
}