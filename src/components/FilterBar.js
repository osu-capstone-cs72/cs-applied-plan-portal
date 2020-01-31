import React from "react";
import PropTypes from "prop-types";

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
          {Object.keys(this.props.options).map(key => (
            <option className="form-control" key={key} value={key}>
              {this.props.options[key]}
            </option>
          ))}
        </select>
      </div>
    );
  }
}