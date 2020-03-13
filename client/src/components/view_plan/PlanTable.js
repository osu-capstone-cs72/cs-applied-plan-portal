/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";


function PlanTable(props) {

  const style = css`
    width: 100%;
    margin-top: 150px;

    #courses-table {
      width: 95%;
      margin: 50px auto;
      width: 90%;
    }

    #courses-table, th, tr, td, th {
      border-collapse: collapse;
    }

    th {
      text-align: left;
    }

    td, th {
      padding: 5px;
    }
    
    table {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }

    table thead tr th {
      background: var(--color-lightgray-100);
      color: var(--color-gray-400);
      font-variant-caps: all-small-caps;
      font-weight: 500;
      font-size: 12pt;
      border-bottom: none;
      padding: 0.5rem 2rem;
      /*padding: 10px;*/
      font-weight: bold;
      white-space: nowrap;
    }
    
    table tbody tr td {
      vertical-align: middle;
      padding: 1rem 2rem;
    }
    
    tbody tr td:nth-of-type(3) {
      text-align: right;
    }

    @media print {

      & {
        margin-top: 0;
      }

      table, thead, tr, td, th {
        border: 1px black solid;
        border-bottom: 1px black solid;
        border-radius: 0;
      }

    }
  
  `;

  return (
    <div id="table-container" css={style}>
      <table id="courses-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Name</th>
            <th>Credit Hours</th>
            <th>Prerequisites</th>
          </tr>
        </thead>
        <tbody>
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
  courses: PropTypes.array,
  loading: PropTypes.bool
};