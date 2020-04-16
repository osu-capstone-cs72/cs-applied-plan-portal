/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {hashToColor} from "../../utils/hashToColor";

function Advisor(props) {

  const [initials, setInitials] = useState("");
  const iconColor = hashToColor(props.firstName + " " + props.lastName);

  const style = css`

    & {
      position: relative;
      margin-right: -1.5rem;
      display: inline-block;
      height: 3rem;
      width: 3rem;
      border-radius: 50%;
      background: ${iconColor};
      text-decoration: none !important;
    }

    .icon-text {
      color: white;
      font-weight: bold;
      line-height: 3rem;
      text-align: center;
    }

  `;

  // get the initials from the first and last name
  useEffect(() => {
    const first = props.firstName.charAt(0);
    const last = props.lastName.charAt(0);
    setInitials(first + last);
  }, [props.firstName, props.lastName]);

  return (
    <abbr className="advisor-icon" css={style} title={props.firstName + " " + props.lastName}>
      <p className="icon-text" >
        {initials}
      </p>
    </abbr>
  );

}
export default Advisor;

Advisor.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string
};