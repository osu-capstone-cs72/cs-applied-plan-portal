/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import NavBar from "../Navbar";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";
import PlanReviews from "./PlanReviews";
import {useParams, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import BounceLoader  from "react-spinners/BounceLoader";

function ViewPlan(props) {

  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [userId, setUserId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState(-1);
  const [courses, setCourses] = useState(
    [[], [{
      courseId: 0,
      credits: null,
      courseName: "",
      courseCode: "",
      prerequisites: ""
    }], []]
  );
  const [comments, setComments] = useState(
    [{
      commentId: 0,
      userId: 0,
      time: null,
      text: ""
    }]
  );
  const [reviews] = useState(
    [{
      planId: 0,
      userId: 0,
      time: null,
      status: -1
    }]
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
  }`;

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

        // get user name
        url = `http://${server}/user/${userId}`;
        let response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setStudentName(obj.firstName + " " + obj.lastName);
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

  }, [planId, props.history]);

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
        planName={planName} status={status} />
      <PlanTable courses={courses} />
      <PlanReviews reviews={reviews}/>
      <PlanComments comments={comments} onUpdate={() => { handleAddComment(planId); }}/>
    </div>
  );
}
export default withRouter(ViewPlan);

ViewPlan.propTypes = {
  history: PropTypes.object
};