/** @jsx jsx */

import {css, jsx} from "@emotion/core";

function PageInternalError() {

  const styleStatusContainer = css`
    margin: 100px;
  `;

  const styleStatusCode = css`
  `;

  const styleStatusText = css`
  `;

  return (

    <div className="status-container" css={styleStatusContainer}>
      <h1 className="status-code" css={styleStatusCode}>500 Internal Server Error</h1>
      <p className="status-text" css={styleStatusText}>The server encountered an internal error
            and was unable to complete your request.</p>
    </div>

  );
}
export default PageInternalError;