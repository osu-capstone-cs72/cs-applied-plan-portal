/** @jsx jsx */

import {css, jsx} from "@emotion/core";

function PageNotFound() {

  const style = css`
    margin: 100px;
  `;

  return (

    <div className="status-container" css={style}>
      <h1 className="status-code">404 Page Not Found</h1>
      <p className="status-text">The page you are looking for does not exist.</p>
    </div>

  );
}
export default PageNotFound;