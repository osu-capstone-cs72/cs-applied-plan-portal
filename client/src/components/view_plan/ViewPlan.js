/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import NavBar from "../Navbar";
import PageSpinner from "../general/PageSpinner";
import PlanTable from "./PlanTable";
import CreateReview from "./CreateReview";
import PlanMetadata from "./PlanMetadata";
import ActivityFeed from "./ActivityFeed";
import {useParams, withRouter} from "react-router-dom";
import {getToken, getProfile} from "../../utils/authService";
import PropTypes from "prop-types";
import PageInternalError from "../general/PageInternalError";
import PageNotFound from "../general/PageNotFound";
const PHE = require("print-html-element");

function ViewPlan(props) {

  const [pageError, setPageError] = useState(0);
  const [currentUser, setCurrentUser] = useState(
    {
      id: 0,
      role: 0,
      firstName: "",
      lastName: ""
    }
  );
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [userId, setUserId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState(-1);
  const [activity, setActivity] = useState([]);
  const [courses, setCourses] = useState([]);
  const {planId} = useParams();

  const style = css`
  `;

  useEffect(() => {
    async function fetchData(planId) {
      setLoading(true);
      try {

        const token = getToken();
        let created = "";
        let userId = 0;
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        let url = `http://${server}/plan/${planId}` +
          `?accessToken=${token}`;
        let obj = [];

        try {

          // get plan data
          const response = await fetch(url);
          if (response.ok) {
            // get data from the response
            obj = await response.json();
            userId = obj.studentId;
            created = obj.created;
            setCourses(obj.courses);
            setPlanName(obj.planName);
            setUserId(obj.studentId);
            setStatus(parseInt(obj.status));
            setStudentName(obj.firstName + " " + obj.lastName);
            // add the intial review
            setActivity([{
              reviewId: 0,
              commentId: 0,
              status: 2,
              planId: planId,
              userId: userId,
              time: created,
              firstName: obj.firstName,
              lastName: obj.lastName
            }]);
          } else {
            // we got a bad status code. send to 404 page
            setPageError(404);
            return;
          }

        } catch (err) {
          // send to 500 page if a server error happens while fetching plan
          setPageError(500);
          return;
        }

        // get active user information
        const profile = getProfile();
        url = `http://${server}/user/${profile.sub}/` +
          `?accessToken=${token}`;
        let response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setCurrentUser(
            {
              id: obj.userId,
              role: obj.role,
              firstName: obj.firstName,
              lastName: obj.lastName
            }
          );
        }

        // get plan activity
        url = `http://${server}/plan/${planId}/activity/` +
          `?accessToken=${token}`;
        response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setActivity(prev => [...obj.activities, ...prev]);
        }

      } catch (err) {
        // this is a server error
        console.log("An internal server error occurred. Please try again later.");
      }
      setLoading(false);
    }
    fetchData(planId);

  }, [planId, props.history]);

  function handleAddComment(e) {
    setActivity(prev => [e, ...prev]);
  }

  function handleChangeStatus(e) {
    setActivity(prev => [e, ...prev]);
    setStatus(parseInt(e.status));
  }

  function handlePrint() {
    const opts = {
      pageTitle: `OSU CS Applied Plan Portal: Plan ${planId}`,
    };
    PHE.printElement(document.getElementById("printable-content"), opts);
  }

  if (!pageError) {
    return (
      <div className="view-plan" css={style}>
        <PageSpinner loading={loading} />
        <NavBar showSearch={false} />
        <div id={"printable-content"}>
          <PlanMetadata studentName={studentName} userId={userId}
            planName={planName} status={status} currentUser={currentUser}
            onPrint={() => handlePrint()}/>
          <PlanTable courses={courses} />
        </div>
        <CreateReview currentUser={currentUser}
          onNewStatus={e => handleChangeStatus(e)} />
        <ActivityFeed activity={activity} currentUser={currentUser}
          onNewComment={e => handleAddComment(e)} />
      </div>
    );
  } else if (pageError === 404) {
    return <PageNotFound />;
  } else {
    return <PageInternalError />;
  }

}
export default withRouter(ViewPlan);

ViewPlan.propTypes = {
  history: PropTypes.object
};