/** @jsx jsx */

import React from "react";
import NavBar from "../navbar/Navbar";
import {getProfile} from "../../utils/authService";
import {formatTime} from "../../utils/formatTime";
import Advisor from "./Advisor";
import PageSpinner from "../general/PageSpinner";
import PageInternalError from "../general/PageInternalError";
import {renderStatus} from "../../utils/renderStatus";

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

    // retrieve the logged in user and set user ID accordingly
    // if user cannot be retrieved, we will get an invalid user ID (0)
    const profile = getProfile();
    const userId = profile.userId;

    const getUrl = `/user/${userId}/plans`;

    let obj = [];

    try {
      const results = await fetch(getUrl);
      if (results.ok) {
        obj = await results.json();

        // modify how advisors are listed in our plans object
        // we will convert advisors listed as a string into an array
        // of objects
        for (let i = 0; i < obj.plans.length; i++) {
          if (obj.plans[i].advisors !== null) {

            // split the advisor string into an array of full names
            // obj.plans[i].advisors = obj.plans[i].advisors.split(",");
            const fullNames = obj.plans[i].advisors.split(",");
            obj.plans[i].advisors = [];

            // split the advisor full names into a first and last name
            for (let j = 0; j < fullNames.length; j++) {
              const splitName = fullNames[j].split(" ");
              if (splitName.length >= 2) {
                obj.plans[i].advisors.push({
                  firstName: splitName[0],
                  lastName: splitName[1]
                });
              }
            }
          }
        }

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

    #student-home-container {
      margin: 100px 0 auto;
      width: 100%;
    }

    #student-home-contents-container {
      margin: 25px auto;
      width: 60%;
    }

    .student-plans-table {
      margin: 0 auto;
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

    table.student-plans-table  thead tr th:nth-of-type(2) {
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

  `;

    if (!this.state.pageError) {
      return (
        <div id="student-home-page" css={style}>
          <PageSpinner loading={this.state.loading} />
          <NavBar />

          <div id="student-home-container">
            <div id="student-home-contents-container">

              <table className="student-plans-table">
                <thead>
                  <tr>
                    <th className="student-plans-data">Name</th>
                    <th className="student-plans-data">Reviewers</th>
                    <th className="student-plans-data">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.plans ? this.state.plans.map(plan =>
                    <tr key={plan.planId + "a"} onClick={() => this.goToPlan(plan)}>
                      <td className="student-plans-data" key={plan.planId + "b"}>
                        <div className="table-item-title">{plan.planName}</div>
                        <div className="table-item-subtitle"><small>{renderStatus(plan.status)}</small></div>
                      </td>
                      <td className="student-plans-data" key={plan.planId + "c"}>
                        {plan.advisors ? (plan.advisors.map(advisor =>
                          <Advisor key={advisor.firstName + advisor.lastName}
                            firstName={advisor.firstName} lastName={advisor.lastName} />
                        )) : (
                          null
                        )}
                      </td>
                      <td className="student-plans-data" key={plan.planId + "d"}>
                        {formatTime(plan.lastUpdated)}
                      </td>
                    </tr>) : null}
                </tbody>
              </table>
              <button className="new-plan-button" onClick={() => window.location.href = "/createPlan"}></button>

            </div>
          </div>

        </div>
      );
    } else {
      return <PageInternalError />;
    }
  }
}
