import React from "react";
import PropTypes from "prop-types";

export default class PlanMetadata extends React.Component {
  static get propTypes() {
    return {
      studentName: PropTypes.string,
      onid: PropTypes.number,
      planName: PropTypes.string,
      status: PropTypes.number
    };
  }

  constructor(props) {
    super(props);
    this.renderStatus = this.renderStatus.bind(this);
  }

  renderStatus() {
    switch (this.props.status) {
      case 0:
        return "Rejected";
      case 1:
        return "Awaiting student changes";
      case 2:
        return "Awaiting review";
      case 3:
        return "Awaiting final review";
      case 4:
        return "Accepted";
      default:
        return "Undefined status";
    }
  }

  render() {
    return (
      <div className="plan-metadata">
        <div className="metadata-field">
          <p className="field-type">Student Name:</p>
          <p className="field-text">{this.props.studentName}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">User ID:</p>
          <p className="field-text">{this.props.onid}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Plan Name:</p>
          <p className="field-text">{this.props.planName}</p>
        </div>
        <div className="metadata-field">
          <p className="field-type">Plan Status:</p>
          <p className="field-text">{this.renderStatus()}</p>
        </div>
        <div className="metadata-field">
          <button>Edit Plan</button>
        </div>
      </div>
    );
  }

}