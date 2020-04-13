/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import NavBar from "../navbar/Navbar";
import PageSpinner from "../general/PageSpinner";
import PlanTable from "./PlanTable";
import ListSimilarPlans from "./ListSimilarPlans";
import CreateReview from "./CreateReview";
import PlanMetadata from "./PlanMetadata";
import ActivityFeed from "./ActivityFeed";
import {useParams, withRouter} from "react-router-dom";
import {getProfile} from "../../utils/authService";
import PropTypes from "prop-types";
import PageInternalError from "../general/PageInternalError";
import PageNotFound from "../general/PageNotFound";
import PHE from "print-html-element";

function ViewPlan(props) {

  const [pageError, setPageError] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [created, setCreated] = useState("");
  const [status, setStatus] = useState(-1);
  const [activity, setActivity] = useState([]);
  const [courses, setCourses] = useState([]);
  const {planId} = useParams();
  const [cursor, setCursor] = useState({
    primary: "null",
    secondary: "null"
  });
  const [currentUser, setCurrentUser] = useState(
    {
      id: 0,
      role: 0,
      firstName: "",
      lastName: ""
    }
  );

  const style = css`
    display: inline-block;
    width: 100%;
    margin: 0 auto;
  `;

  // get primary plan data
  useEffect(() => {
    fetchPlan(planId);
    // eslint-disable-next-line
  }, [planId]);

  // get activity feed data for plan
  useEffect(() => {
    // fetch the plan activity if the plan has loaded
    // or if the plan ID or plan info has changed
    if (created !== "" && studentFirstName !== "" && studentLastName !== "") {

      const newCursor = {
        primary: "null",
        secondary: "null"
      };

      fetchActivity(planId, newCursor);

    }
    // eslint-disable-next-line
  }, [planId, created, studentFirstName, studentLastName]);

  // get plan data based on the plan ID
  async function fetchPlan(planId) {
    setLoading(true);
    try {

      let url = `api/plan/${planId}`;
      let obj = [];

      try {

        // get plan data
        const response = await fetch(url);
        if (response.ok) {
          // get data from the response
          obj = await response.json();
          setCreated(obj.created);
          setCourses(obj.courses);
          setPlanName(obj.planName);
          setUserId(obj.studentId);
          setStatus(parseInt(obj.status));
          setStudentFirstName(obj.firstName);
          setStudentLastName(obj.lastName);
          setEmail(obj.email);
        } else {
          // we got a bad status code
          if (response.status === 500) {
            setPageError(500);
          } else {
            setPageError(404);
          }
          return;
        }

      } catch (err) {
        // send to 500 page if a server error happens while fetching plan
        setPageError(500);
        return;
      }

      // retrieve the logged in user and set user ID accordingly
      // if user cannot be retrieved, we will get an invalid user ID (0)
      const profile = getProfile();

      url = `api/user/${profile.userId}`;
      const response = await fetch(url);
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

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }
    setLoading(false);
  }

  // get the activity feed for the plan that matches the given plan ID
  async function fetchActivity(planId, cursor) {
    setLoading(true);
    try {

      const initialReview =
      {
        id: "0r",
        status: 5,
        planId: planId,
        userId: userId,
        time: created,
        firstName: studentFirstName,
        lastName: studentLastName
      };
      const url = `api/plan/${planId}/activity/${cursor.primary}/` +
      `${cursor.secondary}`;
      let obj = [];

      // get plan activity
      const response = await fetch(url);

      if (response.ok) {

        // get data from the response
        obj = await response.json();

        // if this is the first fetch for the current plan
        // then ensure that the activity feed is empty to start
        let pastActivity = activity;
        if (cursor.primary === "null" && cursor.secondary === "null") {
          pastActivity = [];
        }

        // if we are showing all activity then show the initial review
        if (obj.nextCursor.primary === "null") {
          setActivity([...pastActivity, ...obj.activity, initialReview]);
        } else {
          setActivity([...pastActivity, ...obj.activity]);
        }
        setCursor(obj.nextCursor);

      } else {
        // if there is no activity to show, then show the initial review
        // but first wait for all of the plan metadata to load
        if (activity.length === 0 && created !== "" && studentFirstName !== "" && studentLastName !== "") {
          setActivity([initialReview]);
        }
      }

    } catch (err) {
      // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }
    setLoading(false);
  }

  // add a new comment to the activity feed
  function handleAddComment(e) {
    setActivity(prev => [e, ...prev]);
  }

  // add a new review to the activity feed and update the metadata
  function handleChangeStatus(e) {
    setActivity(prev => [e, ...prev]);
    setStatus(parseInt(e.status));
  }

  // show a prompt for printing a plan
  function handlePrint() {
    const opts = {
      pageTitle: `OSU CS Applied Plan Portal: Plan ${planId}`,
    };
    PHE.printElement(document.getElementById("view-plan-container"), opts);
  }

  // handle a user request to delete the current plan
  async function handleDelete() {

    if (window.confirm("Are you sure that you want to delete this plan?")) {
      setLoading(true);
      try {
        const url = `api/plan/${planId}`;

        // delete plan data
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          // redirect user to home
          alert("Plan deleted.");
          props.history.push("/");
          return;
        } else {
          // we got a bad status code. show error
          const obj = await response.json();
          alert(obj.error);
        }

      } catch (err) {
        // send to 500 error. show error
        alert("An internal server error occurred. Please try again later.");
      }
      setLoading(false);
    }
  }

  if (!pageError) {
    return (
      <div id="view-plan-container" css={style}>
        <PageSpinner loading={loading} />
        <NavBar showSearch={false} />
        <PlanMetadata studentName={studentFirstName + " " + studentLastName} userId={userId} email={email}
          planName={planName} status={status} currentUser={currentUser} courses={courses}
          onPrint={() => handlePrint()} onDelete={() => handleDelete()} />
        <PlanTable courses={courses} />
        <ListSimilarPlans />
        <CreateReview currentUser={currentUser} status={status}
          onNewStatus={e => handleChangeStatus(e)} />
        <ActivityFeed activity={activity} currentUser={currentUser}
          status={status} loading={loading}
          cursor={cursor} onNewComment={e => handleAddComment(e)}
          onShowMore={cursor => fetchActivity(planId, cursor)}/>
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
