import React, {useState, useEffect} from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";
import Navbar from "../Navbar";

export default function StudentCreatePlan() {

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [warning, setWarning] = useState("");

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

  function handleRemoveCourse(course) {
    setCourses(courses.filter(prev => prev.courseId !== course.courseId));
  }

  return (
    <div className="student-create-plan">
      <Navbar showSearch={false} searchContent={null}/>
      <EditPlan courses={courses} onRemoveCourse={e => handleRemoveCourse(e)} edit={false} />
      <CourseContainer warning={warning} onAddCourse={e => handleAddCourse(e)}
        onNewWarning={e => setWarning(e)}/>
    </div>
  );
}