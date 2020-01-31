import React from "react";
import PropTypes from "prop-types";
import "../public/index.css";


export default class Course extends React.Component {
  static get propTypes() {
    return {
      key: PropTypes.any,
      code: PropTypes.any,
      title: PropTypes.any,
      credits: PropTypes.any,
      description: PropTypes.any,
      prereqs: PropTypes.any,
      addCourse: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      full: false
    };

    this.arrowButton = this.arrowButton.bind(this);
    this.addButton = this.addButton.bind(this);
  }

  arrowButton() {
    this.setState({
      full: !this.state.full
    });
  }

  addButton() {
    this.props.addCourse(this.props);
  }

  render() {
    return (
      <div className="course">
        <p>{this.props.code} - {this.props.title}</p>
        {this.state.full && <p>Credit hours: {this.props.credits}</p>}
        {this.state.full && <p>{this.props.description}</p>}
        {this.state.full && <p>Prerequisites: {this.props.prereqs}</p>}
        <div className="course-btn-container">
          <button className="btn btn-add" onClick={this.addButton}>+ Add to plan</button>
          {this.state.full ? <button className="expand-btn" onClick={this.arrowButton}><i className="fad fa-angle-double-up"></i>-</button>
            : <button className="expand-btn" onClick={this.arrowButton}><i className="fad fa-angle-double-down"></i>+</button>}
        </div>
      </div>
    );
  }
}