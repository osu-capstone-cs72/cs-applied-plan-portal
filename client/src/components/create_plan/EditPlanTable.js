/** @jsx jsx */

import PropTypes from "prop-types";
import PlanCourse from "./PlanCourse";
import {css, jsx} from "@emotion/core";
import { Desktop, Mobile } from "../../utils/responsiveUI";
import {SCREENWIDTH} from "../../utils/constants";

// table showing all of the currently selected courses
function EditPlanTable(props) {

  const width = SCREENWIDTH.MOBILE.MAX;
  const style = css`

    & {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      overflow-x: hidden;
      overflow-y: auto;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      background: white;
      border-radius: 0.5rem;
      position: relative;
      @media(max-width: ${width}px){
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);

      }
    }

    #courses-table, th, tr, td, th {
      border-collapse: collapse;
    }

    #credit{
      @media(max-width: ${width}px){
        padding: 10px;
      }
    }

    th {
      text-align: left;
      top: 0;
      position: sticky;
    }

    td, th {
      padding: 5px;
    }
    
    table {
      /*border-radius: 0.5rem;*/
      overflow: hidden;
      padding: 1rem;
      background: var(--color-lightgray-50);
      background: white;
      position: relative;
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
    
    tbody tr td:nth-of-type(4), thead tr th:nth-of-type(4) { 
      width: 1%;
    }
    
    tbody tr td:nth-of-type(3), thead tr th:nth-of-type(3) { 
      width: 8%;
    }
    
    tbody tr td:nth-of-type(n+2), thead tr th:nth-of-type(2) {
      text-align: right;
      @media(max-width: ${width}px){
        text-align: center;
      }
    }
  `;

  return (
    <div id="edit-plan-container" css={style}>
      <table className="edit-plan-table">
        <thead>
          <tr>
            <th>Course</th>
            <th id="credit">Credits</th>
            <Desktop>
              <th></th>
            </Desktop>
            <th>
              <Desktop>
                Remove
              </Desktop>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.courses.map(c =>
            <PlanCourse
              key={c.courseId}
              courseId={c.courseId}
              courseCode={c.courseCode}
              courseName={c.courseName}
              credits={c.credits}
              onRemoveCourse={e => props.onRemoveCourse(e)}
            />
          )}
        </tbody>
      </table>
    </div>
  );

}
export default EditPlanTable;

EditPlanTable.propTypes = {
  onRemoveCourse: PropTypes.func,
  courseId: PropTypes.number,
  courses: PropTypes.array
};