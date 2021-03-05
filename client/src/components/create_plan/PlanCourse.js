/** @jsx jsx */

import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";
import { Mobile,Desktop } from "../../utils/responsiveUI";
import {SCREENWIDTH} from "../../utils/constants";


// a single selected course
function PlanCourse(props) {
  const width = SCREENWIDTH.MOBILE.MAX;
  
  const style = css`

    td.button{
      @media(max-width: ${width}px){
        position: relative;
        right: 10px;;
      }
    }

    .remove-button {
      display: inline-block;
      margin-left: auto;
      margin-right: auto;
      padding: 1rem 1rem;
      background: var(--color-red-500);
      color: var(--color-red-50);
      border-radius: 0.5rem;
      border: none;
      @media(max-width: ${width}px){
        background: transparent;
        color: red;
        font-size: x-large
      }
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
      <td className="planCredit">{props.credits}</td>
      <Desktop>
        <td></td>
      </Desktop>
      
      <td className="button">
        <button className="remove-button" onClick={removeButton}>
          <Desktop>
            Remove
          </Desktop>
          <Mobile>
            <i class="fas fa-trash-alt"></i>
          </Mobile>
        </button>
      </td>
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
};;