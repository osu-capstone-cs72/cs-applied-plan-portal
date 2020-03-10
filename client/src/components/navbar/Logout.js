/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {logout} from "../../utils/authService";

function Logout() {

  const style = css`

    & {
      height: 35px;
    }

  `;

  // logout the current user
  function logoutUser() {
    logout();
  }

  return (
    <button className="logout-button" css={style} onClick={() => logoutUser()}>
      Log out
    </button>
  );

}
export default Logout;