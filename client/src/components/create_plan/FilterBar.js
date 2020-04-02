import React from "react";
import PropTypes from "prop-types";
import Subject from "../../utils/subject";

export default class FilterBar extends React.Component {
  static get propTypes() {
    return {
      options: PropTypes.any,
      value: PropTypes.any,
      onValueChange: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onValueChange(event.target.value);
  }

  render() {
    return (
      <div>
        <select value={this.props.value} onChange={this.handleChange}>
          <option className="form-control" key={0} value={"*"}>
            Any Subject
          </option>
          {Subject.Subject.map((subject) => (
            <option className="form-control" key={subject.code} value={subject.code}>
              {subject.code} - {subject.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}