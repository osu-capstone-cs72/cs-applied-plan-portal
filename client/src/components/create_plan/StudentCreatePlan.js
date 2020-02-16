import React, {useState, useEffect} from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";
import Navbar from "../Navbar";
import {useParams} from "react-router-dom";


export default function StudentCreatePlan() {

  const {planId} = useParams();

  const [courses, setCourses] = useState(
    [{
      courseId: 0,
      credits: null,
      courseName: "",
      courseCode: "",
      prerequisites: ""
    }]
  );
  // const [totalCredits, setTotalCredits] = useState(0);
  const [edit, setEdit] = useState(false);

  // call checkUrl once on mount to see if the user is creating a new plan or editing an existing one
  useEffect(() => {

    // check the URL to see if the user is editing an existing plan or not
    // if yes, get all the courses from an API call
    function checkUrl() {
      if (window.location.href.includes("/editPlan")) {
        setEdit(true);
        getCourses(planId);
      }
    }

    checkUrl();

  }, [planId]);

  async function getCourses(planId) {

    try {

      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/plan/${planId}/`;
      let obj = [];

      const response = await fetch(url);
      if (response.ok) {
      // get data from the response
        obj = await response.json();
        // courses are placed in the second array of the response object (3 arrays total)
        setCourses(obj[1]);
      }

    } catch (err) {
    // this is a server error
      console.log("An internal server error occurred. Please try again later.");
    }

  }

  function updateCourses(newCourses) {
    setTimeout(() => null);
    setCourses(newCourses);
    // document.getElementById("plan-name-input").value += "u";
    // document.getElementById("plan-name-input").blur();
  }

  function removeCourse(course) {
    const newCourses = courses;
    for (let i = 0; i < newCourses.length; i++) {
      if (newCourses[i].courseCode === course.courseCode) {
        newCourses.splice(i, 1);
      }
    }
    setCourses(newCourses);
  }

  return (
    <div className="student-create-plan">
      <Navbar showSearch={false} searchContent={null}/>
      <EditPlan courses={courses} remove={removeCourse} edit={edit} />
      <CourseContainer addCourses={courses} updateCourses={updateCourses} />
    </div>
  );
}