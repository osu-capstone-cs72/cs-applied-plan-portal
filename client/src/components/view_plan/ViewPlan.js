/** @jsx jsx */

import { useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import Navbar from "../navbar/Navbar";
import PageSpinner from "../general/PageSpinner";
import PlanTable from "./PlanTable";
import ListSimilarPlans from "./ListSimilarPlans";
import CreateReview from "./CreateReview";
import PlanMetadata from "./plan_meta_data/PlanMetadata";
import ActivityFeed from "./ActivityFeed";
import { useParams, withRouter } from "react-router-dom";
import { getProfile } from "../../utils/authService";
import PropTypes from "prop-types";
import PageInternalError from "../general/PageInternalError";
import PageNotFound from "../general/PageNotFound";
import PHE from "print-html-element";

// the view plan page
function ViewPlan(props) {
  const [pageError, setPageError] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [created, setCreated] = useState("");
  const [status, setStatus] = useState(-1);
  const [activity, setActivity] = useState([]);
  const [courses, setCourses] = useState([]);
  const { planId } = useParams();
  const [cursor, setCursor] = useState({
    primary: "null",
    secondary: "null",
  });
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    role: 0,
    firstName: "",
    lastName: "",
  });
  const [request, setRequest] = useState({
    primary: "null",
    secondary: "null",
    planId: planId,
  });

  const style = css``;

  // get current user data for creating comments or reviews
  useEffect(() => {
    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    async function fetchUser() {
      try {
        setUserLoading(true);
        const profile = getProfile();
        const url = `/api/user/${profile.userId}`;
        const response = await fetch(url);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {
          if (response.ok) {
            // get data from the response
            const obj = await response.json();
            setCurrentUser({
              id: obj.userId,
              role: obj.role,
              firstName: obj.firstName,
              lastName: obj.lastName,
            });
          }

          setUserLoading(false);
        }
      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          console.log(
            "An internal server error occurred. Please try again later."
          );
        }
      }
    }

    fetchUser();

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };
  }, []);

  // get primary plan data
  useEffect(() => {
    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    // get plan data based on the plan ID
    async function fetchPlan(planId) {
      try {
        setPlanLoading(true);
        const url = `/api/plan/${planId}`;
        let obj = [];

        // get plan data
        const response = await fetch(url);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {
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

          setPlanLoading(false);
        }
      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          // send to 500 page if a server error happens while fetching plan
          setPageError(500);
        }
      }
    }

    fetchPlan(planId);

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, [planId]);

  // get activity feed data for plan
  useEffect(() => {
    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    // get the activity feed for the plan that matches the given plan ID
    async function fetchActivity(planId, cursor) {
      try {
        setFeedLoading(true);
        const initialReview = {
          id: "0r",
          status: 5,
          planId: planId,
          userId: userId,
          time: created,
          firstName: studentFirstName,
          lastName: studentLastName,
        };
        const url =
          `/api/plan/${planId}/activity/${cursor.primary}/` +
          `${cursor.secondary}`;
        let obj = [];

        // get plan activity
        const response = await fetch(url);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {
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
            if (
              activity.length === 0 &&
              created !== "" &&
              studentFirstName !== "" &&
              studentLastName !== ""
            ) {
              setActivity([initialReview]);
            }
          }

          setFeedLoading(false);
        }
      } catch (err) {
        // this is a server error
        console.log(
          "An internal server error occurred. Please try again later."
        );
      }
    }

    if (created !== "" && studentFirstName !== "" && studentLastName !== "") {
      const newCursor = {
        primary: request.primary,
        secondary: request.secondary,
      };
      fetchActivity(planId, newCursor);
    }

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, [request, created, studentFirstName, studentLastName]);

  // track the state of multiple page components loading and
  // display a spinner if any part of the page is still loading
  useEffect(() => {
    if (planLoading || userLoading || feedLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [planLoading, userLoading, feedLoading]);

  // add a new comment to the activity feed
  function handleAddComment(e) {
    setActivity((prev) => [e, ...prev]);
  }

  // add a new review to the activity feed and update the metadata
  function handleChangeStatus(e) {
    setActivity((prev) => [e, ...prev]);
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
        const url = `/api/plan/${planId}`;

        // delete plan data
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
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

  function requestActivity(planId, cursor) {
    setRequest({
      primary: cursor.primary,
      secondary: cursor.secondary,
      planId: planId,
    });
  }

  if (!pageError) {
    return (
      <div id="view-plan-container" css={style}>
        <PageSpinner loading={loading} />
        <Navbar currentPlan={planId} />
        <PlanMetadata
          studentName={studentFirstName + " " + studentLastName}
          userId={userId}
          email={email}
          planName={planName}
          status={status}
          currentUser={currentUser}
          courses={courses}
          onPrint={() => handlePrint()}
          onDelete={() => handleDelete()}
        />
        <PlanTable courses={courses} />
        <ListSimilarPlans />
        <CreateReview
          currentUser={currentUser}
          status={status}
          onNewStatus={(e) => handleChangeStatus(e)}
        />
        <ActivityFeed
          activity={activity}
          currentUser={currentUser}
          status={status}
          loading={loading}
          cursor={cursor}
          onNewComment={(e) => handleAddComment(e)}
          onShowMore={(cursor) => requestActivity(planId, cursor)}
        />
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
  history: PropTypes.object,
};
