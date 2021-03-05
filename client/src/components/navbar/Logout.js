/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {logout} from "../../utils/authService";
import {Desktop, Mobile} from "../../utils/responsiveUI";


// logout button
function Logout() {
  const style = css`
    & {
      display: inline-block
    }
    
    .logout-button {
      height: 35px;
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.15);
      }
    }
  `;

  // logout the current user
  function logoutUser() {
    logout();
  }

  return (
    <div css={style}>
      <Desktop>
        <button
          className="logout-button"
          onClick={() => logoutUser()}
        >
          Log Out
        </button>
      </Desktop>

      <Mobile>
        <button
          className="logout-button"
          onClick={() => logoutUser()}
        >
          <i className="fas fa-sign-out-alt fa-xs"></i>
        </button>
      </Mobile>
    </div>
  );
}
export default Logout;
