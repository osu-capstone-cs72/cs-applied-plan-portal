import React, {useState} from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";
import Navbar from "../Navbar";

export default function StudentCreatePlan() {

  const [courses, setCourses] = useState([]);
  const [warning, setWarning] = useState("");

  function removeCourse(course) {
    const newCourses = courses;
    for (let i = 0; i < newCourses.length; i++) {
      if (newCourses[i].courseId === course.courseId) {
        newCourses.splice(i, 1);
      }
    }
    setCourses(newCourses);
  }

  function handleAddCourse(course) {

    // check that new course isn't already in array
    for (let i = 0; i < courses.length; i++) {
      // check for duplicate courses
      if (course.courseId === courses[i].courseId) {
        setWarning("This course is already in your plan.");
        return;
      }
      // check for required courses
      if (course.restriction === 1) {
        setWarning("You've selected a required course.");
        return;
      }
      // check for graduate courses
      if (course.restriction === 2) {
        setWarning("You've selected a graduate course.");
        return;
      }
    }

    // add the new course
    setCourses(prev => [...prev, course]);
    setWarning("");

  }

  return (
    <div className="student-create-plan">
      <Navbar showSearch={false} searchContent={null}/>
      <EditPlan courses={courses} remove={removeCourse} edit={false} />
      <CourseContainer warning={warning} onAddCourse={e => handleAddCourse(e)} 
        onNewWarning={e => setWarning(e)}/>
    </div>
  );
}