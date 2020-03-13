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

    const token = getToken();
    const value = document.getElementById("search-container").value;
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const codeUrl = `http://${server}/course/courseCode/${value}/?accessToken=${token}`;
    const nameUrl = `http://${server}/course/courseName/${value}/?accessToken=${token}`;
    let obj = [];
    try {
      const results = await fetch(codeUrl);
      if (results.ok) {
        obj = await results.json();
        this.setState({
          courses: obj.courses
        });
      } else {
        const results = await fetch(nameUrl);
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
      flex: 50%;
      margin-top: 65px;
      align-items: stretch;
      justify-items: stretch;
      display: flex;
      flex-direction: column;


      .explore-courses {
      }

      .search-container {
        margin: 10px;
        padding: 8px;
        display: inline-block;
      }

      .course-filter {
        float: right;
        margin: 25px;
        margin-right: 50px;
      }

      .form {
        display: inline;
      }
    `;

    return (
      <div className="course-container" css={style}>
        <div className="top-bar">
          <div className="search-container">
            <form className="form form-inline my-2 my-lg-0" onSubmit={this.submitHandler}>
              <input id="search-container" className="form-control mr-sm-2" type="text" placeholder="Search.." name="search"/>
            </form>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.filterSearch}><i className="fa fa-search"></i></button>
          </div>
          <form className="course-filter form-group">
            <FilterBar options={filters} value={this.state.filter} onValueChange={this.handleFilterChange}/>
          </form>
        </div>
        <ErrorMessage text={this.props.warning} />
        <div className="explore-courses">
          {this.state.courses.length > 0 ? this.state.courses.map(c =>
            <Course key={c.courseCode} courseId={c.courseId} courseCode={c.courseCode} courseName={c.courseName} credits={c.credits}
              description={c.description} prerequisites={c.prerequisites} restriction={c.restriction} onAddCourse={e => this.props.onAddCourse(e)}/>
          ) : (
            <div>Search for courses...</div>
          )}
        </div>
      </div>
    );
  }
}