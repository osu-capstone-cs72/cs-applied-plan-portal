/** @jsx jsx */

import {useState, useEffect} from "react";
import EditPlan from "./EditPlan";
import CourseSearch from "./CourseSearch";
import Navbar from "../navbar/Navbar";
import PageSpinner from "../general/PageSpinner";
import {useLocation, useParams} from "react-router-dom";
import PageInternalError from "../general/PageInternalError";
import PageNotFound from "../general/PageNotFound";
import {css, jsx} from "@emotion/core";
import {SCREENWIDTH} from "../../utils/constants";

// create plan page
export default function StudentCreatePlan() {

  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageError, setPageError] = useState(0);
  const [planName, setPlanName] = useState("");
  const [courses, setCourses] = useState([]);
  const [warning, setWarning] = useState("");
  const [reqCourseOption, setReqCourseOption] = useState([]);
  const [edit, setEdit] = useState(0);
  const {planId} = useParams();
  const location = useLocation();
  
  const width = SCREENWIDTH.MOBILE.MAX; 


  const style = css`
    & {
      display: grid;
      width: 100vw;
      height: 100vh;
      max-height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      grid-template-columns: 1rem 7fr 5rem 3fr 1rem;
      grid-template-rows: 50px 50px 1fr auto 0px;
      grid-column-gap: 0px;
      grid-row-gap: 1rem;
      grid-template-areas: 'navbar  navbar  navbar  navbar  navbar'
                           'left    plan    center  search  right'
                           'left    plan    center  search  right'
                           'left    plan    center  search  right'
                           'bottom  bottom  bottom  bottom  bottom';
      @media(max-width: ${width}px){
          grid-template-areas:
              'navbar'
              'search'
              'plan ';
          grid-template-rows: 81px 94px auto;
          grid-template-columns: auto;
          grid-row-gap: 0;
      }
    }
    
    #navbar {
      grid-area: navbar;
    }
    
    #search {
      grid-area: search;
    }
  `;

  // when editing a plan, load previously selected courses
  useEffect(() => {
    async function fetchPlan(planId) {
      setPlanLoading(true);
      try {
        const url = `/api/plan/${planId}`;
        let obj = [];

        const response = await fetch(url);
        if (response.ok) {
        // get data from the response
          obj = await response.json();
          // get the courses array from the plan object
          setCourses(obj.courses);
          setPlanName(obj.planName);
          setPlanLoading(false);
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

    async function searchCourse(planId) {
        setPlanLoading(true);
        // List of prefilled courses
        let appCourses = [["CS 331", "CS 434", "MTH 254", "MTH 341", "ST 421", "CS 475"], // Artificial Intelligence
                       ["CS 434", "CS 440", "BI 212", "BI 213"], // ? Bioinformatics
                       ["CS 440"], // Business & Entrepreneurship
                       ["CS 321", "CS 370", "CS 373", "CS 427", "CS 478"], // Cybersecurity
                       ["CS 434", "CS 440", "CS 475", "MTH 254", "MTH 341", "ST 421", ], // ? Data Science
                       ["CS 468", "CS 453", "CS 492", "PSY 340"], // Human Computer Interaction
                       ["CS 331", "CS 434", "ROB 421", "ROB 456", "MTH 254", "MTH 341", "PH 211", "PH 221"], // Robot Intelligence
                       ["CS 450"], // Simulation & Game Programming
                       ["CS 370", "CS 492", "CS 493"]]; // ? Web & Mobile Application Development
        // Some prefilled course requirements are options between two courses. This is a list of those options for each
        // applied plan
        let reqCourses = [[], ["CS 453", "CS 458"], [], [], ["CS 453", "CS 458"], [], [], [], ["CS 458", "CS 468"]]
        // If this is a prefill plan, add prefilled courses
        if (planId >= 1 && planId <=  9) {  // planId index at 1 to set null planId as custom plan
            let i;
            let prefillClasses = [];
            for (i = 0; i < appCourses[planId - 1].length; i++) {
                try {
                    const url = `/api/course/search/${appCourses[planId - 1][i]}/*`;
                    const results = await fetch(url);
                    
                    if (results.ok) {
                        let obj = await results.json();
                        if (obj && obj.courses && obj.courses.length > 0) {
                            let c;
                            for (c of obj.courses) {
                                if (c.courseCode === appCourses[planId - 1][i]) {
                                    prefillClasses.push(c);
                                    break;
                                }
                            }
                        }
                    }
                }
                catch (err) {
                    console.log("Failed to add required courses. Err: " + err);
                }
            }
            setCourses(prefillClasses);
            setReqCourseOption(reqCourses[planId - 1]);
        }
        setPlanLoading(false);
    }
    // only fetch a plan if we are on the edit plan page
    if (location.pathname.substring(0, 9) === "/editPlan" && planId) {
        setEdit(parseInt(planId));
        fetchPlan(planId);
    }
    // if we're on create plan page check if plan is prefilled plan and add requisite courses
    else if (location.pathname.substring(0, 11) === "/createPlan") {
        if (planId) {
            searchCourse(parseInt(planId));
        }
    }

  }, [planId, location]);

  // track the state of multiple page components loading and
  // display a spinner if any part of the page is still loading
  useEffect(() => {
    if (planLoading || submitLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [planLoading, submitLoading]);

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
        <PageSpinner loading={loading} />
        <Navbar currentPlan={0} />
        <EditPlan courses={courses} reqCourse={reqCourseOption} edit={edit} planName={planName} onLoading={load => setSubmitLoading(load)}
          onChangePlanName={e => setPlanName(e)} onRemoveCourse={e => handleRemoveCourse(e)}  />
      
        <CourseSearch warning={warning} onAddCourse={e => handleAddCourse(e)}
          onNewWarning={e => setWarning(e)}/>
      </div>
    );
  } else if (pageError === 404) {
    return <PageNotFound />;
  } else {
    return <PageInternalError />;
  }
}