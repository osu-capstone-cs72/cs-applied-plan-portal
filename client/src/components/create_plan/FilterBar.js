import React from "react";
import PropTypes from "prop-types";
import Subject from "../../utils/subject";

function FilterBar(props) {

  // keep track of changes to filter selection
  function handleChange(event) {
    props.onValueChange(event.target.value);
  }

  return (
    <div>
      <select value={props.value} onChange={handleChange}>
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
export default FilterBar;

FilterBar.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onValueChange: PropTypes.func
};