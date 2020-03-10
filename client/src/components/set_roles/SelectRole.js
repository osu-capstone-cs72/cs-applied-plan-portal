/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {PropTypes} from "prop-types";
import {formatRole} from "../../utils/formatRole";

function SelectRole(props) {

  const style = css`
  `;

  async function setNewRole() {

    const select = document.getElementById(`change-user-role-${props.userId}`);

    const confirmMessage = `Are you sure you want to set ${props.userName}'s ` +
      `role to "${formatRole(parseInt(select.value, 10))}?"`;

    if (window.confirm(confirmMessage)) {

      console.log("Change the role");

    } else {

      const select = document.getElementById(`change-user-role-${props.userId}`);
      select.value = props.role;

    }

  }

  return (
    <select className="change-user-role" id={`change-user-role-${props.userId}`}
      css={style} defaultValue={props.role} onChange={() => setNewRole()}>

      <option value="0">Student</option>
      <option value="1">Advisor</option>
      <option value="2">Head Advisor</option>

    </select>
  );

}
export default SelectRole;

SelectRole.propTypes = {
  role: PropTypes.number,
  userId: PropTypes.number,
  userName: PropTypes.string
};
