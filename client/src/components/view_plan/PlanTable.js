/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import BounceLoader  from "react-spinners/BounceLoader";

function PlanTable(props) {

  const style = css`
    width: 100%;

    .loader-container {
      visibility: ${props.loading ? "visible" : "hidden"};
      position: fixed;
      margin-left: -5.25em;
      margin-bottom: +5.25em;
      left: 50%;
      bottom: 50%;
      width: 0;
      height: 0;
      z-index: 99;
    }

    #courses-table {
      width: 95%;
      margin: 50px auto;
      width: 90%;
    }

    #courses-table, th, tr, td, th {
      border: 1px solid black;
      border-collapse: collapse;
    }

    th {
      text-align: left;
    }

    td, th {
      padding: 5px;
    }
  
  `;

  return (
    <div id="table-container" css={style}>
      <div className="loader-container">
        <BounceLoader
          className="bounce-loader"
          size={150}
          color={"orange"}
        />
      </div>
      <table id="courses-table">
        <tbody>
          <tr>
            <th>Course</th>
            <th>Name</th>
            <th>Credit Hours</th>
            <th>Prerequisites</th>
          </tr>
          {props.courses[1].map((course) => (
            <tr key={course.courseId}>
              <td key={course.courseId + "a"}>
                {course.courseCode}
              </td>
              <td key={course.courseId + "b"}>
                {course.courseName}
              </td>
              <td key={course.courseId + "c"}>
                {course.credits}
              </td>
              <td key={course.courseId + "d"}>
                {course.prerequisites}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}
export default PlanTable;

PlanTable.propTypes = {
  courses: PropTypes.any,
  loading: PropTypes.bool
};