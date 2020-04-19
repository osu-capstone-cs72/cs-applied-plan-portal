/** @jsx jsx */

import React from "react";
import Course from "./Course";
import FilterBar from "./FilterBar";
import ErrorMessage from "../general/ErrorMessage";
import PropTypes from "prop-types";
import {css, jsx} from "@emotion/core";

export default class CourseSearch extends React.Component {

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
      filter: "*"
    };

    this.filterSearch = this.filterSearch.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.updateFilterAndSearch = this.updateFilterAndSearch.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeWarning = this.changeWarning.bind(this);
  }

  async filterSearch() {
    this.changeWarning("");

    this.setState({
      courses: []
    });
    let value = document.getElementById("search-container").value;
    if (value === "") {
      value = "*";
    }
    const getUrl = `/api/course/search/${value}/${this.state.filter}`;
    if (value === "*" && this.state.filter === "*") {
      return;
    }
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
      this.changeWarning("An internal server error occurred. Please try again later.");
    }
  }

  async handleFilterChange(value) {
    this.changeWarning("");
    this.setState({
      filter: value
    });
  }

  async updateFilterAndSearch(e) {
    await this.handleFilterChange(e);
    await this.filterSearch();
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
      display: grid;
      grid-gap: 1rem;
      grid-template-columns: auto auto;
      grid-template-rows: 50px auto auto 1fr;
      grid-template-areas: 'title    category'
                           'search   search'
                           'warn     warn'
                           'results  results';
      
      .search-title {
        font-weight: 600;
        font-size: 23px;
        grid-area: title;
        display: flex;
        align-items: center;
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
      
      .search-results {
        grid-area: results;
        overflow-x: hidden;
        overflow-y: auto;
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
        border: 1.5px solid #dfdad8;
        box-shadow: none;
      }

      .course-filter {
        display: flex;
        align-items: center;
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
      <div id="search" css={style}>
        <div className="search-title">Search</div>
        <div className="search-container">
          <form className="form my-2 my-lg-0" onSubmit={this.submitHandler}>
            <input id="search-container" className="form-control mr-sm-2" type="text" placeholder="Search for courses..." name="search"/>
          </form>
          <button className="search-button" type="submit" onClick={this.filterSearch}>Search</button>
        </div>
        <form className="course-filter form-group">
          <FilterBar value={this.state.filter} onValueChange={this.updateFilterAndSearch}/>
        </form>
        <ErrorMessage text={this.props.warning} />
        <div className="search-results">
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