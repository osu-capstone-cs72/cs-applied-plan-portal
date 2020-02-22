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

function ViewPlan(props) {

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
  const [courses, setCourses] = useState(
    [[], [{
      courseId: 0,
      credits: null,
      courseName: "",
      courseCode: "",
      prerequisites: ""
    }], []]
  );
  const {planId} = useParams();

  const style = css`
  `;

  useEffect(() => {
    async function fetchData(planId) {
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
            userId = obj[0][0].studentId;
            created = obj[0][0].created;
            setCourses(obj);
            setPlanName(obj[0][0].planName);
            setUserId(obj[0][0].studentId);
            setStatus(parseInt(obj[0][0].status));
          } else {
            // we got a bad status code. send to 404 page
            props.history.push("/404");
            return;
          }

        } catch (err) {
          // send to 500 page if a server error happens while fetching plan
          console.log("An internal server error occurred. Please try again later.");
          props.history.push("/500");
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

        // get plan user name
        url = `http://${server}/user/${userId}/` +
          `?accessToken=${token}`;
        response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
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
        }

        // get plan activity
        url = `http://${server}/plan/${planId}/activity/` +
          `?accessToken=${token}`;
        response = await fetch(url);
        setLoading(false);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setActivity(prev => [...obj, ...prev]);
        }

      } catch (err) {
        // this is a server error
        console.log("An internal server error occurred. Please try again later.");
      }
    }
    fetchData(planId);

  }, [planId, props.history]);

  async function handleAddComment(e) {
    setActivity(prev => [e, ...prev]);
  }

  async function handleChangeStatus(e) {
    setActivity(prev => [e, ...prev]);
    setStatus(parseInt(e.status));
  }

  return (
    <div className="view-plan" css={style}>
      <PageSpinner loading={loading} />
      <NavBar showSearch={false} />
      <PlanMetadata studentName={studentName} userId={userId}
        planName={planName} status={status} currentUser={currentUser} />
      <PlanTable courses={courses} />
      {currentUser.role ? (
        <CreateReview currentUser={currentUser}
          onNewStatus={e => handleChangeStatus(e)} />
      ) : (
        null
      )}
      <ActivityFeed activity={activity} currentUser={currentUser}
        onNewComment={e => handleAddComment(e)} />
    </div>
  );
}
export default withRouter(ViewPlan);

ViewPlan.propTypes = {
  history: PropTypes.object
};