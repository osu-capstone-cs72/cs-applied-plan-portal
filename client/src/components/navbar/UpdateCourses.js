/** @jsx jsx */

import {css, jsx} from "@emotion/core";

function UpdateCourses() {

  const style = css`

    & {
      display: inline-block;
      height: 35px;
    }

    update-courses-button {
      height: 35px;
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;
    }

  `;

  // update the available courses in the database
  // using the OSU course catalog
  function startCourseUpdate() {
    // logout();
  }

  return (
    <div css={style}>
      <button className="update-courses-button" onClick={() => startCourseUpdate()}>
        Update Courses
      </button>
    </div>
  );

}
export default UpdateCourses;