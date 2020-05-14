/** @jsx jsx */

import {css, jsx} from "@emotion/core";

// 500 error code page
function PageInternalError() {

  const style = css`
    margin: 100px;
  `;

  return (

    <div className="status-container" css={style}>
      <h1 className="status-code">500 Internal Server Error</h1>
      <p className="status-text">The server encountered an internal error
            and was unable to complete your request.</p>
    </div>

  );
}
export default PageInternalError;