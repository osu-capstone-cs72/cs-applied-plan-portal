/** @jsx jsx */

import {useState, useEffect} from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";
import Navbar from "../navbar/Navbar";
import PageSpinner from "../general/PageSpinner";
import {useParams} from "react-router-dom";
import PageInternalError from "../general/PageInternalError";
import PageNotFound from "../general/PageNotFound";
import {css, jsx} from "@emotion/core";

export default function StudentCreatePlan() {

  const [loading, setLoading] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [pageError, setPageError] = useState(0);
  const [planName, setPlanName] = useState("");
  const [courses, setCourses] = useState([]);
  const [warning, setWarning] = useState("");
  const [edit, setEdit] = useState(0);
  const {planId} = useParams();

  const style = css`
    display: flex;
  `;

  useEffect(() => {
    async function fetchPlan(planId) {
      setLoading(true);
      try {
        const url = `/plan/${planId}`;
        let obj = [];

        const response = await fetch(url);
        if (response.ok) {
        // get data from the response
          obj = await response.json();
          // get the courses array from the plan object
          setCourses(obj.courses);
          setPlanName(obj.planName);
          setLoading(false);
        } else {
          // we got a bad status code
          if (response.status === 500) {
            setPageError(500);
          } else {
            setPageError(404);
          }
        }
      } catch (err) {
        // this is a server error
        setPageError(500);
      }
    }

    // only fetch a plan if we are on the edit plan page
    if (planId) {
      setEdit(parseInt(planId));
      fetchPlan(planId);
    }

  }, [planId]);

  // adds a new course to the courses array
  function handleAddCourse(course) {
    // check that new course isn't already in array
    for (let i = 0; i < courses.length; i++) {
      // check for duplicate courses
      if (course.courseId === courses[i].courseId) {
        setWarning("This course is already in your plan.");
        return;
      }
    }
    // check for required courses
    if (course.restriction === 1) {
      setWarning("Required courses are not allowed.");
      return;
    }
    // check for graduate courses
    if (course.restriction === 2) {
      setWarning("Graduate courses are not allowed.");
      return;
    }
    // see if the course has a defined number of credits
    if (isNaN(course.credits)) {

      // check with the user to see how many credits should be applied
      const creditArray = course.credits.split(" to ");
      if (creditArray.length >= 2) {

        // prompt the user to enter the credits
        let credits = prompt(
          `Please select between ${creditArray[0]} and ${creditArray[1]} credits`, ""
        );
        credits = parseInt(credits, 10);

        // see if the user entered a valid number of credits
        if (credits >= creditArray[0] && credits <= creditArray[1] && !isNaN(credits)) {
          course.credits = credits;
          setCourses(prev => [...prev, course]);
          setWarning("");
        } else {
          setWarning("Invalid credit hours selected for course.");
        }

      }

    } else {
      // add the new course
      setCourses(prev => [...prev, course]);
      setWarning("");
    }
  }

  // removes a course from the courses array
  function handleRemoveCourse(course) {
    setCourses(courses.filter(prev => prev.courseId !== course.courseId));
  }

  if (!pageError) {
    return (
      <div className="student-create-plan" css={style}>
        <PageSpinner loading={loading} subloading={subloading}/>
        <Navbar showSearch={false} searchContent={null}/>
        <EditPlan courses={courses} edit={edit} planName={planName} onLoading={load => setSubloading(load)}
          onChangePlanName={e => setPlanName(e)} onRemoveCourse={e => handleRemoveCourse(e)}  />
        <CourseContainer warning={warning} onAddCourse={e => handleAddCourse(e)}
          onNewWarning={e => setWarning(e)}/>
      </div>
    );
  } else if (pageError === 404) {
    return <PageNotFound />;
  } else {
    return <PageInternalError />;
  }
}