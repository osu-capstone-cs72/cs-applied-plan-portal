/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {logout} from "../../utils/authService";
import { Desktop, Mobile } from "../../utils/responsiveUI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt as signoutIcon } from '@fortawesome/free-solid-svg-icons';

// logout button
function Logout() {

  const responSize = "max-width: 860px";
  const style = css`

    &{
      height: 35px;
      border: 1px solid white;
      color: white;
      border-radius: 0.25rem;
      background: transparent;
        // @media(${responSize}){
        // border: none;
        // position: relative;
        // top:60%;
        // font-size: 1.5em;
        // }
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
  <div className="logout">
  <Desktop>
    <button className="logout-button" css={style} onClick={() => logoutUser()}>
      Log Out
    </button>
  </Desktop>

  <Mobile>
      <button className="logout-button" css={style} onClick={() => logoutUser()}>
      <i className="fas fa-sign-out-alt fa-xs"></i>
    </button>
  </Mobile>

  </div>
  );

}
export default Logout;