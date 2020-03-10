/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {PropTypes} from "prop-types";
import {formatRole} from "../../utils/formatRole";
import {getToken} from "../../utils/authService";

function SelectRole(props) {

  const style = css`
  `;

  async function setNewRole() {

    const select = document.getElementById(`change-user-role-${props.userId}`);

    const confirmMessage = `Are you sure you want to set ${props.userName}'s ` +
      `role to "${formatRole(parseInt(select.value, 10))}?"`;

    if (window.confirm(confirmMessage)) {

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const patchURL = `http://${server}/user/${props.userId}/?accessToken=${token}`;
      const patchObj = {
        role: select.value
      };

      try {
        props.onLoading(true);
        fetch(patchURL, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(patchObj),
        })
          .catch((error) => alert("Error: " + error));
      } catch (err) {
        // this is a server error
        alert("An internal server error occurred. Please try again later.");
      }
      props.onLoading(false);

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
  userName: PropTypes.string,
  onLoading: PropTypes.func
};
