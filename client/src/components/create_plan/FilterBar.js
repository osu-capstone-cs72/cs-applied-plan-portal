/** @jsx jsx */

import React from "react";
import PropTypes from "prop-types";
import Subject from "../../utils/subject";
import {css, jsx} from "@emotion/core";
import { Desktop, Mobile } from "../../utils/responsiveUI";
import {SCREENWIDTH} from "../../utils/constants";

// course subject filter bar
function FilterBar(props) {

  const width = SCREENWIDTH.MOBILE.MAX;
  
  const styles =css`
    .form-control:focus {
      color: red;
    }

  `;

  // keep track of changes to filter selection
  function handleChange(event) {
    props.onValueChange(event.target.value);
  }

  // handle responsive onchange for filter
   function handleChangeMobile(event) {
      props.onValueChange(event.target.value);
      // var select = document.querySelector("#select");
      // select.size=1;
      // select.blur();

  }

  // onfocus function, when onfocus, change option size to 10
  function handleFocus(event){
      var select = document.querySelector("#select");
      select.size = 10;
      
  }

  // when onblur, change option size to 1
  function handleBlur(event){
      var select = document.querySelector("#select");
      select.size = 1;
  }

  return (
    <div>

      <Mobile>
        <select id="select"
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          value={props.value} 
          onChange={handleChangeMobile}
        >
        <option className="form-control" key={0} value={"*"}>
          Any Subject
        </option>
        {Subject.Subject.map((subject) => (
          <option className="form-control" key={subject.code} value={subject.code}>
            {subject.code} - {subject.name}
          </option>
        ))}
      </select>
      </Mobile>

      <Desktop>
        <select id="select"
                value={props.value} 
                onChange={handleChange}
        >
          <option className="form-control" key={0} value={"*"}>
            Any Subject
          </option>
            {Subject.Subject.map((subject) => (
              <option className="form-control" key={subject.code} value={subject.code}>
                {subject.code} - {subject.name}
              </option>
            ))}
         </select>
      </Desktop>
      
    </div>
  );

}
export default FilterBar;

FilterBar.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onValueChange: PropTypes.func

};