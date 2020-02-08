/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function PlanTable(props) {

  const styleTextAlign = css`
    text-align: left;
  `;

  const styleBorders = css`
    border: 1px solid black;
    border-collapse: collapse;
  `;

  const stylePadding = css`
    padding: 5px;
  `;

  const styleTableContainer = css`
    width: 100%;
  `;

  const styleCoursesTable = css`
    width: 95%;
    margin: 50px auto;
    width: 90%;
  `;

  return (
    <div className="table-container" css={styleTableContainer}>
      <table className="courses-table" css={[styleCoursesTable, styleBorders]}>
        <tbody>
          <tr css={styleBorders}>
            <th css={[styleBorders, stylePadding, styleTextAlign]}>Course</th>
            <th css={[styleBorders, stylePadding, styleTextAlign]}>Name</th>
            <th css={[styleBorders, stylePadding, styleTextAlign]}>Credit Hours</th>
            <th css={[styleBorders, stylePadding, styleTextAlign]}>Prerequisites</th>
          </tr>
          {props.courses[1].map((course) => (
            <tr key={course.courseId} css={styleBorders}>
              <td key={course.courseId + "a"} css={[styleBorders, stylePadding]}>
                {course.courseCode}
              </td>
              <td key={course.courseId + "b"} css={[styleBorders, stylePadding]}>
                {course.courseName}
              </td>
              <td key={course.courseId + "c"} css={[styleBorders, stylePadding]}>
                {course.credits}
              </td>
              <td key={course.courseId + "d"} css={[styleBorders, stylePadding]}>
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
  courses: PropTypes.any
};