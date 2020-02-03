import React from "react";
import Course from "./Course";
import FilterBar from "./FilterBar";
import filters from "./FilterList";
import PropTypes from "prop-types";
import "../public/index.css";
export default class CourseContainer extends React.Component {
  static get propTypes() {
    return {
      updateCourses: PropTypes.func
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
    this.addCourse = this.addCourse.bind(this);
  }

  async filterSearch() {

    const value = document.getElementById("search-container").value;
    const url = `/api/course/courseCode/${value}`;
    let obj = [];

    try {
      const results = await fetch(url);
      obj = await results.json();
    } catch (err) {
      alert(err);
    }

    this.setState({
      courses: obj
    });

  }

  handleFilterChange(value) {
    this.setState({
      filter: value
    });
    let courses = this.state.courses;
    courses = courses.filter(c => {
      return (
        c.code.startsWith(value)
      );
    });
    this.setState({
      courses: courses
    });
  }

  addCourse(course) {
    const newCourses = this.state.addCourses;
    newCourses.unshift(course);
    this.setState({
      addCourses: newCourses
    });
    this.props.updateCourses(newCourses);
  }

  render() {
    return (
      <div className="course-container">
        <div className="top-bar">
          <div className="search-container">
            <form className="form-inline my-2 my-lg-0">
              <input id="search-container" className="form-control mr-sm-2" type="text" placeholder="Search.." name="search"/>
            </form>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.filterSearch}><i className="fa fa-search"></i></button>
          </div>
          <form className="course-filter form-group">
            <FilterBar options={filters} value={this.state.filter} onValueChange={this.handleFilterChange}/>
          </form>
        </div>
        <div className="explore-courses">
          {this.state.courses.length > 0 ? this.state.courses.map(c => <Course key={c.courseId} code={c.courseCode} title={c.courseName} credits={c.credits}
            description={c.description} prereqs={c.prerequisites} addCourse={this.addCourse}/>) :
            <div>Search for courses...</div>}
        </div>
      </div>
    );
  }
}