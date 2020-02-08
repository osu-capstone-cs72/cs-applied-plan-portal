/** @jsx jsx */

import {css, jsx} from "@emotion/core";

function PageNotFound() {

  const styleStatusContainer = css`
    margin: 100px;
  `;

  const styleStatusCode = css`
  `;

  const styleStatusText = css`
  `;

  return (

    <div className="status-container" css={styleStatusContainer}>
      <h1 className="status-code" css={styleStatusCode}>404 Page Not Found</h1>
      <p className="status-text" css={styleStatusText}>The page you are looking for does not exist.</p>
    </div>

  );
}
export default PageNotFound;