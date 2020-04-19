/** @jsx jsx */

import {useEffect, useState} from "react";
import Course from "./Course";
import FilterBar from "./FilterBar";
import ErrorMessage from "../general/ErrorMessage";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";

function CourseContainer(props) {

  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("*");
  const [request, setRequest] = useState("*");

  const style = css`
    flex: 33%;
    margin-top: 65px;
    margin-right: 1rem;
    margin-left: 30px;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: auto auto;
    grid-template-rows: 36px auto auto 1fr;
    grid-template-areas:
    'title category'
    'warn warn'
    'search search'
    'results results';
    
    .search-title {
      font-weight: 600;
      font-size: 23px;
      grid-area: title;
      display: flex;
      align-items: flex-end;
    }
    
    .search-category {
      grid-area: category;
    }
    
    .search-button {
      background: var(--color-orange-500);
      color: var(--color-orange-50);
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
    }
    
    .explore-courses {
      grid-area: results;
    }

    .search-container {
      display: grid;
      grid-template-columns: 3fr 1fr;
      grid-gap: 1rem;
      grid-template-rows: auto;
      grid-area: search;
    }
    
    #search-container {
      padding: 2rem 1rem;
      border: 0;
    }

    .course-filter {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      margin-bottom: 0;
    }
    
    .course-filter select {
      text-align-last: right;
      background: none;
      border: none;
      float: right;
      outline: none;
    }
    
    .form {
      display: inline;
    }
  `;

  // listen for new search requests and perform a new search when one arrives
  useEffect(() => {

    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    async function filterSearch() {
      try {
        changeWarning("");

        setCourses([]);
        let value = document.getElementById("search-container").value;
        if (value === "") {
          value = "*";
        }
        const getUrl = `/api/course/search/${value}/${filter}`;
        let obj = [];

        const results = await fetch(getUrl);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {

          if (results.ok) {
            obj = await results.json();
            setCourses(obj.courses);
          } else {
            // we got a bad status code
            obj = await results.json();
            changeWarning(obj.error);
            setCourses([]);
          }

        }

      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          changeWarning("An internal server error occurred. Please try again later.");
        }
      }
    }

    // don't load search results on the initial mount
    if (mounted) {
      filterSearch();
    } else {
      setMounted(true);
    }

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, [request]);

  // initiates a new course search
  function callSearch() {
    setRequest({
      courses: courses,
      filter: filter
    });
  }

  // if the filter value is changed clear the error field and set the filter
  async function handleFilterChange(value) {
    changeWarning("");
    setFilter(value);
  }

  // prevent default submit behavior of form elements
  function submitHandler(e) {
    e.preventDefault();
    callSearch();
  }

  // update the error field text
  function changeWarning(text) {
    props.onNewWarning(text);
  }

  return (
    <div className="course-container" css={style}>
      <div className="search-title">Search</div>
      <div className="search-container">
        <form className="form my-2 my-lg-0" onSubmit={submitHandler}>
          <input id="search-container" className="form-control mr-sm-2" type="text" placeholder="Search for courses..." name="search"/>
        </form>
        <button className="search-button" type="submit" onClick={callSearch}>Search</button>
      </div>
      <form className="course-filter form-group">
        <FilterBar value={filter} onValueChange={handleFilterChange}/>
      </form>
      <ErrorMessage text={props.warning} />
      <div className="explore-courses">
        {courses.length > 0 ? courses.map(c =>
          <Course key={c.courseId} courseId={c.courseId} courseCode={c.courseCode} courseName={c.courseName} credits={c.credits}
            description={c.description} prerequisites={c.prerequisites} restriction={c.restriction} onAddCourse={e => props.onAddCourse(e)}/>
        ) : (
          <div>Search for courses...</div>
        )}
      </div>
    </div>
  );

}
export default CourseContainer;

CourseContainer.propTypes = {
  updateCourses: PropTypes.func,
  onAddCourse: PropTypes.func,
  onNewWarning: PropTypes.func,
  warning: PropTypes.string
};