/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import NavBar from "../Navbar";
import PlanTable from "./PlanTable";
import CreateReview from "./CreateReview";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";
import PlanReviews from "./PlanReviews";
import {useParams, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import BounceLoader  from "react-spinners/BounceLoader";

function ViewPlan(props) {

  const [currentUserDev] = useState(1); // Development: Selecting the current user
  const [currentUser, setCurrentUser] = useState(
    {
      userId: 0,
      userRole: 0
    }
  );
  const [loading, setLoading] = useState(true);
  const [planCreated, setPlanCreated] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [userId, setUserId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState(-1);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
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
    .loader-container {
      visibility: ${loading ? "visible" : "hidden"};
      position: fixed;
      margin-left: -75px;
      margin-bottom: 75px;
      left: 50%;
      bottom: 50%;
      width: 0;
      height: 0;
      z-index: 99;
    }
  `;

  useEffect(() => {

    async function fetchData(planId) {
      try {

        let userId = 0;
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        let url = `http://${server}/plan/${planId}`;
        let obj = [];

        try {

          // get plan data
          const response = await fetch(url);
          if (response.ok) {
            // get data from the response
            obj = await response.json();
            userId = obj[0][0].studentId;
            setCourses(obj);
            setPlanName(obj[0][0].planName);
            setPlanCreated(obj[0][0].created);
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
        url = `http://${server}/user/${currentUserDev}`;
        let response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setCurrentUser(
            {
              userId: obj.userId,
              userRole: obj.role
            }
          );
        }

        // get plan user name
        url = `http://${server}/user/${userId}`;
        response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setStudentName(obj.firstName + " " + obj.lastName);
        }

        // get plan history
        url = `http://${server}/plan/${planId}/review`;
        response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setReviews(obj);
        }

        // get plan comments
        url = `http://${server}/plan/${planId}/comment`;
        response = await fetch(url);
        setLoading(false);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setComments(obj);
        }

      } catch (err) {
        // this is a server error
        console.log("An internal server error occurred. Please try again later.");
      }
    }
    fetchData(planId);

  }, [planId, props.history, currentUserDev]);

  async function handleAddComment(planId) {

    try {

      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/plan/${planId}/comment`;
      let obj = [];

      // refersh the list of comments
      const response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        setComments(obj);
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }

  }

  async function handleChangeStatus(planId, e) {

    try {

      setStatus(parseInt(e));

      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/plan/${planId}/review`;
      let obj = [];

      // refersh the list of reviews
      const response = await fetch(url);
      if (response.ok) {
        // get data from the response
        obj = await response.json();
        setReviews(obj);
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }

  }

  return (
    <div className="view-plan" css={style}>
      <div className="loader-container">
        <BounceLoader
          size={150}
          color={"orange"}
        />
      </div>
      <NavBar showSearch={false} />
      <PlanMetadata studentName={studentName} userId={userId}
        planName={planName} status={status} currentUser={currentUser} />
      <PlanTable courses={courses} />
      {currentUser.userRole ? (
        <CreateReview currentUser={currentUser}
          onNewStatus={(e) => { handleChangeStatus(planId, e); }} />
      ) : (
        null
      )}
      <PlanReviews reviews={reviews} planCreated={planCreated} userId={userId}
        studentName={studentName} loading={loading} />
      <PlanComments comments={comments} currentUser={currentUser}
        onUpdate={() => { handleAddComment(planId); }} />
    </div>
  );
}
export default withRouter(ViewPlan);

ViewPlan.propTypes = {
  history: PropTypes.object
};