/** @jsx jsx */

import React from "react";
import NavBar from "./navbar/Navbar";
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
    const profile = await getProfile();
    const token = getToken();
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const getUrl = `http://${server}/user/${profile.userId}/plans/` +
      `?accessToken=${token}`;

    let obj = [];

    try {
      const results = await fetch(getUrl);
      if (results.ok) {
        obj = await results.json();

        // modify how advisors are listed in our plans object
        // we will convert advisors listed as a string into an array
        // of objects
        console.log(obj);
        for (let i = 0; i < obj.plans.length; i++) {
          // for (let i = 0; i < 5; i++) {
          console.log(obj.plans[i].advisors);
          // }
        }
        console.log(obj);
        this.setState(obj);
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
        top: 65px;
        width: 60%;
      }

      .student-plans-data {
        padding: 1rem 2rem;
      }

      .new-plan-button {
        position: fixed;
        bottom: 3rem;
        right: 3rem;
        width: 6rem;
        height: 6rem;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M23 10h-9V1h-4v9H1v4h9v9h4v-9h9v-4z"></path></svg>'), var(--color-orange-500);
        border-radius: 50%;
        border: none;
        font-size: 36px;
        font-weight: bold;
        background-size: 3rem 3rem;
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .table-item-title {
        font-weight: 600;
      }

      .table-item-subtitle {
        font-weight: normal;
        color: var(--color-gray-400);
      }
      
      table {
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        padding: 1rem;
        background: var(--color-lightgray-50);
        background: white;
      }

      table thead tr th {
        background: var(--color-lightgray-100);
        color: var(--color-gray-400);
        font-variant-caps: all-small-caps;
        font-weight: 500;
        font-size: 12pt;
        border-bottom: none;
        padding: 1rem 2rem;
        /*padding: 10px;*/
        font-weight: bold;
        white-space: nowrap;
      }

      table.student-plans-table  thead tr th:nth-child(2) {
        /*width: -webkit-fill-available;*/
        width: 30%;
      }

      table tbody tr td {
        vertical-align: middle;
        padding: 1rem 2rem;
      }
      
      table tbody tr {
        cursor: pointer;
      }

      table.student-plans-table tbody tr td {
        cursor: pointer;
      }

      table.student-plans-table tbody tr:hover td .table-item-title {
        text-decoration: underline;
      }

      table.student-plans-table tbody tr td:nth-of-type(1) {
        width: 50%;
        font-weight: 500;
      }
      
      .table-plan-contributor {
        height: 3rem;
        width: 3rem;
        border: 3px solid white;
        border-radius: 50%;
        background: var(--color-gray-100);
        display: inline-block;
      }

      .table-plan-contributor:not(:first-of-type) {
        margin-left: -1.5rem;
      }

      .table-plan-contributor:not(:last-of-type):not(:first-of-type) {
        margin-right: 0.5rem;
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
                <th className="student-plans-data">Advisors</th>
                <th className="student-plans-data">Updated</th>
              </tr>
            </thead>
            <tbody>
              {this.state.plans ? this.state.plans.map(p =>
                <tr key={p.planId + "a"} onClick={() => this.goToPlan(p)}>
                  <td className="student-plans-data" key={p.planId + "b"}>
                    <div className="table-item-title">{p.planName}</div>
                    <div className="table-item-subtitle"><small>{renderStatus(p.status)}</small></div>
                  </td>
                  <td className="student-plans-data" key={p.planId + "c"}>
                    {p.advisors}
                  </td>
                  <td className="student-plans-data" key={p.planId + "d"}>
                    {formatTime(p.lastUpdated)}
                  </td>
                </tr>) : null}
            </tbody>
          </table>
          <button className="new-plan-button" onClick={() => window.location.href = "/createPlan"}></button>
        </div>
      );
    } else {
      return <PageInternalError />;
    }
  }
}
