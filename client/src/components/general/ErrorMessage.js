/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function ErrorMessage(props) {

  const style = css`
    grid-area: warn;

    .error-message, .hidden-error-message {
      border-radius: 0.5rem;
      padding: 0.5rem;
      background: var(--color-yellow-50);
      border: 1px solid var(--color-yellow-300);
      color: var(--color-yellow-800);
    }

    .error-message p, .hidden-error-message p {
      margin-bottom: 0;
    }

    .hide {
      display: none;
    }

  `;

  // When there is no text the error message still takes up the same space.
  // This is to prevent the page from shifting around when an error is displayed.
  return (
    <div css={style} className={props.text === "" ? "hide" : ""}>
      <div className="error-message" css={style}>
        <p>{props.text}</p>
      </div>
    </div>
  );
}
export default ErrorMessage;

ErrorMessage.propTypes = {
  text: PropTypes.string
};