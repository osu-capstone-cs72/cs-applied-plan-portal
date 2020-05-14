/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {logout} from "../../utils/authService";

// logout button
function Logout() {

  const style = css`

    & {
      height: 35px;
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.15);
    }

  `;

  // logout the current user
  function logoutUser() {
    logout();
  }

  return (
    <button className="logout-button" css={style} onClick={() => logoutUser()}>
      Log Out
    </button>
  );

}
export default Logout;