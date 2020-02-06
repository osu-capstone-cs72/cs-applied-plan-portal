import React, {useState, useEffect} from "react";
import PlanTable from "./PlanTable";
import PlanMetadata from "./PlanMetadata";
import PlanComments from "./PlanComments";
import {useParams, withRouter} from 'react-router-dom';

function ViewPlan(props) {
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
  const {planId} = useParams();

  useEffect(() => {
    async function fetchData(planId) {
      try {

        let userId = 0;
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        let url = `http://${server}/plan/${planId}`;
        let obj = [];

        try {
          // get plan data
          let response = await fetch(url);
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
            const { history } = props;
            // if(history) history.push('/404');
            return;
          }
        } catch (err) {
          // send to 500 page if a server error happens while fetching plan
          console.log("An internal server error occurred. Please try again later.");
          const { history } = props;
          // if(history) history.push('/500');
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
    console.log(planId);
    fetchData(planId);
  }, [planId]);

  return (
    <div className="view-plan">
      <PlanMetadata studentName={studentName} userId={userId}
        planName={planName} status={status} />
      <PlanTable courses={courses} />
      <PlanComments comments={comments} />
    </div>
  );
}
export default withRouter(ViewPlan);