/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {statusColor} from "../../utils/renderStatus";

// colored cue that shows the current status of a plan
function StatusCue(props) {

  const iconColor = statusColor(props.status);

  const style = css`

    & {
      display: inline-block;
      margin-right: 1rem;
      height: 1rem;
      width: 1rem;
      border-radius: 50%;
      background: ${iconColor};
      text-decoration: none !important;
    }

  `;

  return (
    <div className="status-icon" css={style} />
  );

}
export default StatusCue;

StatusCue.propTypes = {
  status: PropTypes.number
};