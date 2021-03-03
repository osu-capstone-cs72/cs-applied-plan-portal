/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { BOX_SHADOW_CARD } from "../../utils/constants";

// table of all of the courses in the current plan
function PlanTable(props) {
  const style = css`
    width: 100%;

    #courses-table {
      width: 95%;
      margin: 50px auto;
      width: 90%;
      box-shadow: ${BOX_SHADOW_CARD};
    }

    #courses-table,
    th,
    tr,
    td,
    th {
      border-collapse: collapse;
    }

    th {
      text-align: left;
    }

    td,
    th {
      padding: 5px;
    }

    table {
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
    }

    table thead tr th {
      background: #f4f2f1;
      color: #706c6b;
      font-variant-caps: all-small-caps;
      font-weight: 500;
      font-size: 12pt;
      border-bottom: none;
      padding: 1rem 2rem;
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
        margin: 0;
      }

      th,
      td {
        border: 1px solid black;
        font-size: small;
        text-align: left;
      }

      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      th {
        border-bottom: 1px solid #333333;
      }

      td {
        border-bottom: 1px solid black;
        page-break-inside: avoid;
        page-break-after: auto;
      }

      table,
      tr,
      td,
      th,
      tbody,
      thead,
      tfoot {
        page-break-inside: avoid;
      }

      .restriction-header,
      .restriction-column {
        display: none;
      }
    }
    @media screen and (max-width: 600px) {
      table,
      thead,
      tbody,
      th,
      td,
      tr {
        display: block;
      }

      thead tr {
        display: none;
      }

      tbody tr td:nth-of-type(3) {
        text-align: left;
      }

      tbody tr {
        border-bottom: 1px solid black;
      }

      tbody tr:last-of-type {
        border-style: none;
      }

      td:before {
        font-weight: bold;
      }

      td:nth-of-type(1):before {
        content: "COURSE: ";
      }
      td:nth-of-type(2):before {
        content: "NAME: ";
      }
      td:nth-of-type(3):before {
        content: "CREDITS: ";
      }
      td:nth-of-type(4):before {
        content: "RESTRICTIONS: ";
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
            <th>Credits</th>
            <th className={"restriction-header"}>Restrictions</th>
          </tr>
        </thead>
        <tbody>
          {props.courses.map((course) => (
            <tr key={course.courseId}>
              <td key={course.courseId + "a"}>{course.courseCode}</td>
              <td key={course.courseId + "b"}>{course.courseName}</td>
              <td key={course.courseId + "c"}>{course.credits}</td>
              <td className={"restriction-column"} key={course.courseId + "d"}>
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
  loading: PropTypes.bool,
};
