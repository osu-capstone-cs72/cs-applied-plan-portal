/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {useState, useEffect} from "react";

function PlanTable(props) {

  const [creditSum, setCreditSum] = useState(0);

  const style = css`
    width: 100%;

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

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < props.courses.length; i++) {
      sum += props.courses[i].credits;
    }
    setCreditSum(sum);
  }, [props.courses]);

  return (
    <div id="table-container" css={style}>
      <table id="courses-table">
        <tbody>
          <tr>
            <th>Course</th>
            <th>Name</th>
            <th>Credits ({creditSum})</th>
            <th>Prerequisites</th>
          </tr>
          {props.courses.map((course) => (
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