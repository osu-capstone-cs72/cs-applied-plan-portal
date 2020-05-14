/** @jsx jsx */

import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";

// a single selected course
function PlanCourse(props) {

  const style = css`

    .remove-button {
      display: inline-block;
      margin-left: auto;
      margin-right: auto;
      padding: 1rem 1rem;
      background: var(--color-red-500);
      color: var(--color-red-50);
      border-radius: 0.5rem;
      border: none;
    }
    
    .table-item-title {
      font-weight: 600;
    }

    .table-item-subtitle {
      font-weight: normal;
      color: var(--color-gray-400);
    }

  `;

  // remove the current course from the plan
  function removeButton() {
    props.onRemoveCourse({
      courseId: props.courseId
    });
  }

  return (
    <tr css={style}>
      <td>
        <div className="table-item-title">{props.courseName}</div>
        <div className="table-item-subtitle"><small>{props.courseCode.replace(/([A-z])(\d)/, "$1 $2")}</small></div>
      </td>
      <td>{props.credits}</td>
      <td></td>
      <td><button className="remove-button" onClick={removeButton}>Remove</button></td>
    </tr>
  );

}
export default PlanCourse;

PlanCourse.propTypes = {
  courseId: PropTypes.number,
  courseCode: PropTypes.string,
  courseName: PropTypes.string,
  credits: PropTypes.any,
  onRemoveCourse: PropTypes.func
};