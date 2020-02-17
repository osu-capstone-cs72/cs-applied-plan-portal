import React, {useState} from "react";
import EditPlan from "./EditPlan";
import CourseContainer from "./CourseContainer";
import Navbar from "../Navbar";

export default function StudentCreatePlan() {

  const [courses, setCourses] = useState([]);
  console.log("COURSES:", courses);

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
    let newCourse = true;
    for (let i = 0; i < courses.length; i++) {
      // check for duplicate courses
      if (course.courseId === courses[i].courseId) {
        // this.setState({
        //   warning: "This course is already in your plan."
        // });
        newCourse = false;
        return;
      }
      // check for required courses
      if (course.restriction === 1) {
        // this.setState({
        //   warning: "You've selected a required course."
        // });
      }
      // check for graduate courses
      if (course.restriction === 2) {
        // this.setState({
        // warning: "You've selected a graduate course."
        // });
      }
    }

    if (newCourse) {
      setCourses(prev => [...prev, course]);
    }
  }

  return (
    <div className="student-create-plan">
      <Navbar showSearch={false} searchContent={null}/>
      <EditPlan courses={courses} remove={removeCourse} edit={false} />
      <CourseContainer onAddCourse={e => handleAddCourse(e)} />
    </div>
  );
}