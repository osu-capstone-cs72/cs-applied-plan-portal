/** @jsx jsx */

import React from "react";
import Course from "./Course";
import FilterBar from "./FilterBar";
import ErrorMessage from "../general/ErrorMessage";
import filters from "./FilterList";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";
import {getToken} from "../../utils/authService";

export default class CourseContainer extends React.Component {

  static get propTypes() {
    return {
      updateCourses: PropTypes.func,
      onAddCourse: PropTypes.func,
      onNewWarning: PropTypes.func,
      warning: PropTypes.string
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      addCourses: [],
      filter: ""
    };

    this.filterSearch = this.filterSearch.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeWarning = this.changeWarning.bind(this);
  }

  async filterSearch() {
    this.changeWarning("");

    this.setState({
      courses: []
    });
    const token = getToken();
    const value = document.getElementById("search-container").value;
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const getUrl = `http://${server}/course/search/${value}/?accessToken=${token}`;
    let obj = [];
    try {
      const results = await fetch(getUrl);
      if (results.ok) {
        obj = await results.json();
        this.setState({
          courses: obj.courses
        });
      } else {
        // we got a bad status code
        obj = await results.json();
        this.changeWarning(obj.error);
        this.setState({
          courses: []
        });
      }
    } catch (err) {
      alert("An internal server error occurred. Please try again later.");
    }
  }

  async handleFilterChange(value) {
    this.changeWarning("");
    this.setState({
      filter: value
    });
    if (value !== "none") {
      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const url = `http://${server}/course/courseCode/${value}/?accessToken=${token}`;
      let obj = [];

      try {
        const results = await fetch(url);
        if (results.ok) {
          obj = await results.json();
          this.setState({
            courses: obj.courses
          });
        } else {
          // we got a bad status code
          obj = await results.json();
          this.changeWarning(obj.error);
        }
      } catch (err) {
        alert("An internal server error occurred. Please try again later.");
      }
    } else {
      this.setState({
        courses: []
      });
    }
  }

  submitHandler(e) {
    e.preventDefault();
    this.filterSearch();
  }

  changeWarning(text) {
    this.props.onNewWarning(text);
  }

  render() {

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

    return (
      <div className="course-container" css={style}>
        <div className="search-title">Search</div>
        <div className="search-container">
          <form className="form my-2 my-lg-0" onSubmit={this.submitHandler}>
            <input id="search-container" className="form-control mr-sm-2" type="text" placeholder="Search for courses..." name="search"/>
          </form>
          <button className="search-button" type="submit" onClick={this.filterSearch}>Search</button>
        </div>
        <form className="course-filter form-group">
          <FilterBar options={filters} value={this.state.filter} onValueChange={this.handleFilterChange}/>
        </form>
        <ErrorMessage text={this.props.warning} />
        <div className="explore-courses">
          {this.state.courses.length > 0 ? this.state.courses.map(c =>
            <Course key={c.courseId} courseId={c.courseId} courseCode={c.courseCode} courseName={c.courseName} credits={c.credits}
              description={c.description} prerequisites={c.prerequisites} restriction={c.restriction} onAddCourse={e => this.props.onAddCourse(e)}/>
          ) : (
            <div>Search for courses...</div>
          )}
        </div>
      </div>
    );
  }
}