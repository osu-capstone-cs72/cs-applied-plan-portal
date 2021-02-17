/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import styled from "@emotion/styled";
import Badge from "../../notifications/Badge";
import {PropTypes} from "prop-types";
import {Link} from "react-router-dom";

const Container = styled.div`
  display: inline-block;
  height: 35px;
  color: white;
  border-radius: 0.25rem;
  background: transparent;
`;

const StyledBtn = styled.button`
  &:hover {
    background: rgba(0, 0, 0, 0.15) !important;
  }
`;

const Dropdown = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

  padding: 12px 16px;
  a {
    display: block;
    color: black;
  }
`;

function NotificationDesktop({notifications, handleClick}) {
  const style = css`
    &:hover .dropdown-container {
      display: block;
    }
    .dropdown-content {
    }
  `;

  function DropdownContent({notifications, handleClick}) {
    if (notifications.length === 0) {
      return (
        <Link to={`.`} onClick={(event) => event.preventDefault()}>
          No new notifications
        </Link>
      );
    } else {
      return notifications.map((item, index) => (
        <Link
          key={item.notificationId}
          to={`/viewPlan/${item.planId}`}
          onClick={(event) => handleClick(event, item, index)}
        >
          {item.text}
        </Link>
      ));
    }
  }

  return (
    <Container css={style}>
      <StyledBtn>
        <span>Nofitication</span>
        <Badge list={notifications} />
      </StyledBtn>
      <Dropdown className="dropdown-container">
        <DropdownContent
          className="dropdown-content"
          notifications={notifications}
          handleClick={handleClick}
        />
      </Dropdown>
    </Container>
  );
}

export default NotificationDesktop;

NotificationDesktop.propTypes = {
  notifications: PropTypes.array,
  handleClick: PropTypes.func,
};
