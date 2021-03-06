/** @jsx jsx */

import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";
import { Mobile,Desktop } from "../../utils/responsiveUI";
import {SCREENWIDTH} from "../../utils/constants";
import ErrorMessage from "../general/ErrorMessage";

// a single course description
function Course(props) {

  const width = SCREENWIDTH.MOBILE.MAX;
  const style = css`

    & {
      margin-bottom: 1rem;
      background: #f4f2f1;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-right: 1rem;
      @media(max-width: ${width}px){
        margin-right: 0;
      }
    }

    .add-button {
      display: inline-block;
      margin-left: auto;
      margin-right: auto;
      padding: 1rem 1rem;
      background: var(--color-green-500);
      color: var(--color-green-50);
      border-radius: 0.5rem;
      border: none;
    }

    details summary {
      cursor: pointer;
      height: unset;
      width: 100%;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      user-select: none;
    }

    summary+p {
      margin-top: 1rem;
    }

    details summary::-webkit-details-marker {
      display:none;
    }

    summary::-moz-list-bullet {
      list-style-type: none;
      display: block;
    }

    details summary:before {
      content: '⯈';
      display: inline-block;
      padding: 0 5px 5px 0;
    }

    details[open] summary:before {
      content: '⯆';
      display: inline-block;
      padding: 0 5px 5px 0;
    }

    .add-button {
      margin-right: 0;
      margin-left: auto;
      white-space: nowrap;
    }
    
    .disabled {
      background: var(--color-lightgray-700);
      color: var(--color-gray-50);
      cursor: default;
    }

    .course-title {
      font-weight: 600;
    }
    
    .course-title {
      display: inline-block;
      vertical-align: bottom;
      text-transform: uppercase;
    }

    .course-code {
      color: var(--color-gray-400);
      font-weight: normal;
    }

    p:last-child {
      margin-bottom: 0;
    }
    
    hr {
      border-top-color: #e6e6e5;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `;

  // add the course to the plan
  function addButton() {
    props.onAddCourse({
      courseId: props.courseId,
      courseCode: props.courseCode,
      courseName: props.courseName,
      credits: props.credits,
      description: props.description,
      prerequisites: props.prerequisites,
      restriction: props.restriction
    });
  }

  return (
    <div className="course" css={style}>
      
      <details>
        <summary>
          <div className="course-title">{props.courseName}
            <div className="course-code">
              <small>
                {props.courseCode}
              </small>
            </div>
          </div>
          <button className={`add-button ${props.restriction > 0 ? "disabled" : ""}`} onClick={addButton}>
          <Desktop>
            Add to plan
          </Desktop>
          <Mobile>
            <i class="fas fa-plus"></i>
          </Mobile>
            
          </button>
        </summary>
        <p>{props.credits} credit hour{props.credits !== 1 && "s"}{props.prerequisites === "" && ", no prerequisites"}</p>
        {props.description !== "" &&
          <div>
            <hr/>
            {/* <h4>Description</h4> */}
            <p>{props.description}</p>
          </div>
        }
        {props.prerequisites !== "" &&
          <div>
            <hr/>
            {/* <h4>Restrictions</h4> */}
            <p>{props.prerequisites}</p>
          </div>
        }
      </details>
    </div>
  );

}
export default Course;

Course.propTypes = {
  courseId: PropTypes.number,
  courseCode: PropTypes.string,
  courseName: PropTypes.string,
  credits: PropTypes.string,
  description: PropTypes.string,
  prerequisites: PropTypes.string,
  restriction: PropTypes.number,
  onAddCourse: PropTypes.func,
  warning: PropTypes.string
};