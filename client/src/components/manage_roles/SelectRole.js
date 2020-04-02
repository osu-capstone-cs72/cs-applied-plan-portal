/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {useState} from "react";
import {PropTypes} from "prop-types";
import {formatRole} from "../../utils/formatRole";
import {getToken} from "../../utils/authService";

function SelectRole(props) {

  const [updatedRole, setUpdatedRole] = useState(-1);

  const style = css`

    .change-user-role {
      width: 100%;
      border: 1px solid var(--color-lightgray-600);
      border-radius: 0.5rem;
      padding: 0.5rem 0.5rem;
      flex: 100%;
    }

  `;

  // updates a user's role
  async function setNewRole() {

    const select = document.getElementById(`change-user-role-${props.userId}`);
    const newRole = parseInt(select.value, 10);

    const confirmMessage = `Are you sure you want to set ${props.userName}'s ` +
      `role to "${formatRole(newRole)}?"`;

    if (window.confirm(confirmMessage)) {

      // the user confirmed that they wanted to change the role
      // so we will send a request to the API server
      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const patchURL = `http://${server}/user/${props.userId}/?accessToken=${token}`;
      const patchObj = {
        role: select.value
      };

      try {
        props.onLoading(true);
        await fetch(patchURL, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(patchObj),
        })
          .then(() => setUpdatedRole(newRole))
          .catch((error) => alert("Error: " + error));
      } catch (err) {
        // this is a server error
        alert("An internal server error occurred. Please try again later.");
      }
      props.onLoading(false);

    } else {

      // the user declined to change the role
      // so we need to revert the users role to the previous setting
      if (updatedRole === -1) {
        const select = document.getElementById(`change-user-role-${props.userId}`);
        select.value = props.role;
      } else {
        select.value = updatedRole;
      }

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
  userName: PropTypes.string,
  index: PropTypes.number,
  onLoading: PropTypes.func,
  onNewRole: PropTypes.func
};
