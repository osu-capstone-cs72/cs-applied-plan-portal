/** @jsx jsx */

import {useEffect, useState} from "react";
import Navbar from "../navbar/Navbar";
import {getProfile} from "../../utils/authService";
import {formatTime} from "../../utils/formatTime";
import Advisor from "./Advisor";
import StatusCue from "./StatusCue";
import PageSpinner from "../general/PageSpinner";
import PageInternalError from "../general/PageInternalError";
import {statusText} from "../../utils/renderStatus";
import PlanSelect from "./PlanSelect";
import {SCREENWIDTH} from "../../utils/constants";
import {css, jsx} from "@emotion/core";


// student homepage
function StudentHome() {

  const [pageError, setPageError] = useState(0);
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);

  const width = SCREENWIDTH.MOBILE.MAX;
  const responSize = "max-width: "+ width + "px";

  const style = css`

    #student-home-container {
      margin: 100px 0 auto;
    }

    #student-home-contents-container {
      margin: 25px auto;
      width: 60%;
      @media(${responSize}){
        width:100%;
      }
    }

    .student-plans-table {
      margin: 0 auto;
      @media (${responSize}){
        width: 95%;
      }
    }

    .student-plans-data {
      padding: 1rem 4rem;
      @media(${responSize}){
        padding:0px;
        min-width: 80px;
        text-align: center;
      }
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
      @media(${responSize}){
          position: absolute;
          bottom: 5%;
          right:  5%;
      }
    }

    .table-item-title {
      font-weight: 600;
    }

    .table-item-subtitle {
      display: inline-block;
      font-weight: normal;
    }

    table {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }

    /* all threads */
    table thead tr th {
      background: #f4f2f1;
      color: #706c6b;
      font-variant-caps: all-small-caps;
      font-weight: 500;
      font-size: 12pt;
      border-bottom: none;
      padding: 1rem 2rem;
      /*padding: 10px;*/
      font-weight: bold;
      white-space: nowrap;

    }

    table.student-plans-table thead tr th:nth-of-type(4) {
      /*width: -webkit-fill-available;*/
      //width: 50%;
    }

    table tbody tr td {
      vertical-align: middle;
      padding: 1rem 2rem;
    }

    table tbody tr {
      /*cursor: pointer;*/
    }

    table.student-plans-table tbody tr td {
      cursor: pointer;
      padding: 2rem 2rem;
      @media(${responSize}){
        padding: 1rem 0;
      }
    }

    /* plan title */
    table.student-plans-table tbody tr:hover td .table-item-title {
      text-decoration: underline;
    }

   /* Each plan name*/
    table.student-plans-table tbody tr td:nth-of-type(1) {
      width: 30%;
      font-weight: 500;
    }
   
    .empty-plan-container {
      text-align: center;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    
    .empty-plan-create-button {
      display: block;
      background: var(--color-orange-500);
      border-radius: 0.5rem;
      padding: 1rem;
      width: auto;
      color: white;
      border: none;
      font-size: 18px;
      margin-top: 1rem;
      text-decoration: none !important;
      transition: background 0.1s linear;
    }
    
    .empty-plan-create-button:active {
      background: var(--color-orange-600);
    }

    table.student-plans-table tbody tr:hover {
      background: rgba(0, 0, 0, 0.03);
    }
  
  `;

  // on page load, show all of the current students plans
  useEffect(() => {

    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    // load all of the current students plans
    async function getAllPlans() {

      setLoading(true);

      // retrieve the logged in user and set user ID accordingly
      // if user cannot be retrieved, we will get an invalid user ID (0)
      const profile = getProfile();
      const userId = profile.userId;

      const getUrl = `/api/user/${userId}/plans`;

      let obj = [];

      try {
        const results = await fetch(getUrl);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {

          if (results.ok) {
            obj = await results.json();

            // modify how advisors are listed in our plans object
            // we will convert advisors listed as a string into an array
            // of objects
            for (let i = 0; i < obj.plans.length; i++) {
              if (obj.plans[i].advisors !== null) {

                // split the advisor string into an array of full names
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

            setPlans(obj.plans);

          } else {
            // we got a bad status code
            if (results.status === 500) {
              setPageError(500);
            }
          }

          setLoading(false);

        }

      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          setPageError(500);
        }
      }
    }

    getAllPlans();

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, []);

  // go to the specified plans page
  function goToPlan(plan) {
    window.location.href = `/viewPlan/${plan.planId}`;
  }

  if (!pageError) {
    return (
      <div id="student-home-page" css={style}>
        <PageSpinner loading={loading} />
        <Navbar currentPlan={0} />

        <div id="student-home-container">
          <div id="student-home-contents-container">

            {plans ?

              <table className="student-plans-table">
                <thead>
                  <tr>
                    <th className="student-plans-data">Name</th>
                    <th className="student-plans-data">Status</th>
                    <th className="student-plans-data">Reviewers</th>
                    <th className="student-plans-data">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {plans ? plans.map(plan =>
                    <tr key={plan.planId + "a"} onClick={() => goToPlan(plan)}>
                      <td className="student-plans-data" key={plan.planId + "b"}>
                        <div className="table-item-title">{plan.planName}</div>
                      </td>
                      <td className="student-plans-data" key={plan.planId + "c"}>
                        <StatusCue status={plan.status} />
                        <div className="table-item-subtitle">{statusText(plan.status)}</div>
                      </td>
                      <td className="student-plans-data" key={plan.planId + "d"}>
                        {plan.advisors ? (plan.advisors.map(advisor =>
                          <Advisor key={advisor.firstName + advisor.lastName}
                            firstName={advisor.firstName} lastName={advisor.lastName} />
                        )) : (
                          null
                        )}
                      </td>
                      <td className="student-plans-data" key={plan.planId + "e"}>
                        {formatTime(plan.lastUpdated)}
                      </td>
                    </tr>) : null}
                </tbody>
              </table>
              : <div className="empty-plan-container">
                <h3 className="empty-plan-title">You haven&#39;t created any plans.</h3>
                <button className="empty-plan-create-button" onClick={() => setShowPlans(true)}>Create a plan</button>
              </div>
            }
            {/* <a href="createPlan" title="Create a plan" className="new-plan-button"></a> */}
            <button className="new-plan-button" onClick={() => setShowPlans(true)}></button>
            <PlanSelect hidden={!showPlans} hidePlan={() => setShowPlans(false)}/>
          </div>
        </div>

      </div>
    );
  } else {
    return <PageInternalError />;
  }

}
export default StudentHome;
