/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {slide as Menu} from "react-burger-menu";
import {logout} from "../../../utils/authService";
import ManageRoles from "../../manage_roles/ManageRoles";
import History from "../History";
import Notifications from "../Notifications";

function HeadAdvisorNavMobile({currentPlan}) {
  const style = css`
    /* Position and sizing of burger button */
    .bm-burger-button {
      position: fixed;
      width: 30px;
      height: 24px;
      right: 24px;
      top: 24px;
    }

    /* Color/shape of burger icon bars */
    .bm-burger-bars {
      background: #e8e6e3;
    }

    /* Color/shape of burger icon bars on hover*/
    .bm-burger-bars-hover {
      /* background: #a90000; */
    }
    /* General sidebar styles */
    .bm-menu {
      background: #373a47;
      padding: 2.5em 1.5em 0;
      font-size: 1.15em;
    }

    /* Position and sizing of clickable cross button */
    .bm-cross-button {
      height: 32px;
      width: 32px;
    }

    /* Color/shape of close button cross */
    .bm-cross {
      background: #bdc3c7;
    }
    /* Styling of overlay */
    .bm-overlay {
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }

    & {
      font-size: 1rem;
    }
    a {
      color: white
    }
    .nav-item {
      display: block;
    }
  `;


  const LogoutBtn = () => {
    return (
      <button className="logout-button nav-item" onClick={logout}>
        Log Out
      </button>
    );
  };

  const ManageRoleBtn = () => {
    return (
      <button className="nav-item">
        <a href="/manageRoles">Manage Roles</a>
      </button>
    );
  };

  const HomeBtn = () => {
    return (
      <button className="nav-item"><a href="/">Home</a></button>
    );
  };


  return (
    <div css={style}>
      <Menu right>
        <HomeBtn />
        <ManageRoleBtn />
        <Notifications/>
        <History currentPlan={currentPlan} />
        <LogoutBtn />
      </Menu>
    </div>
  );
}

export default HeadAdvisorNavMobile;

HeadAdvisorNavMobile.propTypes = {
  currentPlan: PropTypes.number,
};
