/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

function ListSimilarPlans() {

  const {planId} = useParams();
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const tooltip = "A similar plan is one that includes all of the same courses" +
    " (but may have additional courses).";

  const style = css`

    & {
      display: flex;
    }
  
    #similar-plans {
      text-align: center;
      padding: 30px;
      padding-bottom: 20px;
      margin: 0 auto;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background: white;
    }

    abbr {
        margin: -25px -25px 5px auto;
        display: block;
        height: 25px;
        width: 25px;
        line-height: 25px;
        font-size: 25px;

        -moz-border-radius: 25px;
        border-radius: 25px;

        background: var(--color-gray-200);
        color: black;
        text-align: center;

        text-decoration: none;
    }

    @media print {
      &, #similar-plans, abbr {
        display: none;
      }
    }

  `;

  useEffect(() => {
    fetchSimilar(planId);
    // eslint-disable-next-line
  }, [planId]);

  async function fetchSimilar(planId) {
    try {

      const url = `/plan/${planId}/similar`;
      let obj = [];

      // get similar plan data
      const response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        setAccepted(obj.accepted);
        setRejected(obj.rejected);
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }
  }

  if (accepted === 0 && rejected === 0) {
    return null;
  } else {
    return (
      <div id="similar-plans-container" css={style}>
        <div id="similar-plans">
          <abbr title={tooltip}>
            ?
          </abbr>
          <p id={"accepted-plans"}>Similar Accepted Plans: {accepted}</p>
          <p id={"rejected-plans"}>Similar Rejected Plans: {rejected}</p>
        </div>
      </div>
    );
  }

}
export default ListSimilarPlans;

ListSimilarPlans.propTypes = {
  courses: PropTypes.any,
  loading: PropTypes.bool
};