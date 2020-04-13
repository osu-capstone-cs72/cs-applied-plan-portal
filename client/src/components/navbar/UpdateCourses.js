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
  async function startCourseUpdate() {

    const firstPrompt = "Update the list of available courses to match the " +
      "current OSU course catalog?";
    const secondPrompt = "Updating the courses may take anywhere from a few minutes " +
      "to a few hours.\n\n " +
      "This action should only be performed when there is not " +
      "a large amount of user traffic and only when there is the expectation " +
      "of new courses existing in the OSU course catalog (once a term).\n\n" +
      "Do you still want to update the current list of available courses?";

    if (window.confirm(firstPrompt) && window.confirm(secondPrompt)) {

      try {

        // request that all courses are updated
        const url = `api/course/updateDatabase`;

        // perform the query
        const response = await fetch(url);
        if (!response.ok) {
          // note that there was an error trying to start the update
          alert("Internal server error. Unable to update courses.");
        }

      } catch (err) {
        // note that there was an error trying to start the update
        alert("Internal server error. Unable to update courses.");
      }
    }

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