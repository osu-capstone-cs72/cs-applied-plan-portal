/** @jsx jsx */

import React, {useState, useEffect} from "react";
import {css, jsx} from "@emotion/react";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import HistoryCommon from "./HistoryCommon";
import HistoryHeadAdv from "../head_advisor_nav/history/HistoryHeadAdv";

// dropdown menu that shows plan view history
function History(props) {
  const [recentPlans, setRecentPlans] = useState([]);
  const [role, setRole] = useState(-1);

  // Fetch role from cookie
  useEffect(() => {
    const role = Cookies.get("role");
    setRole(role);
  }, []);

  // get a list of the most recently viewed plans
  useEffect(() => {
    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    // get the current users most recently viewed plans
    async function getRecentPlans() {
      try {
        const getUrl = `/api/plan/recent`;
        let obj = {};

        const results = await fetch(getUrl);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {
          if (results.ok) {
            obj = await results.json();
            setRecentPlans(obj.plans);
          } else {
            // we got a bad status code.
            if (results.status === 500) {
              console.error(
                "An internal server error occurred. Please try again later."
              );
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          // log server error
          console.error(
            "An internal server error occurred. Please try again later."
          );
        }
      }
    }

    getRecentPlans();

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };
  }, [props.currentPlan]);

  return (
    <React.Fragment>
      {role === "1" && <HistoryCommon recentPlans={recentPlans} />}
      {role === "2" && <HistoryHeadAdv recentPlans={recentPlans} />}
    </React.Fragment>
  );
}
export default withRouter(History);

History.propTypes = {
  currentPlan: PropTypes.number,
};
