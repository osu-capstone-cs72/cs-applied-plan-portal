/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function ErrorMessage(props) {

  const style = css`

    .error-message, .hidden-error-message {
      margin: 5px;
      padding: 5px;
      border: 1px solid var(--color-red-200);;
      background: var(--color-red-100);
      color: black;
    }

    .hidden-error-message {
      display: none;
    }

  `;

  // When there is no text the error message still takes up the same space.
  // This is to prevent the page from shifting around when an error is displayed.
  return (
    (props.text.length ? (

      <div css={style}>
        <div className="error-message" css={style}>
          {props.text}
        </div>
      </div>

    ) : (

      <div css={style}>
        <div className="hidden-error-message" css={style}>
          No Error
        </div>
      </div>

    ))
  );
}
export default ErrorMessage;

ErrorMessage.propTypes = {
  text: PropTypes.string
};