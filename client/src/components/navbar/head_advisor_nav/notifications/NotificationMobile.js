/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import styled from "@emotion/styled";
import {PropTypes} from "prop-types";
import {useState} from "react";
import MenuModal from "../MenuModal";

const Container = styled.div``;

const StyledBtn = styled.button`
  &:hover {
    background: rgba(0, 0, 0, 0.15) !important;
  }
`;

const CountBadge = styled.span`
  margin: 0 5px;
  color: white;
`;

function NotificationMobile({notifications, handleClick}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpenClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <StyledBtn onClick={handleOnOpenClick}>
        <span>Notification</span>
        <CountBadge>
          {notifications.length ? notifications.length : null}
        </CountBadge>
      </StyledBtn>
      <MenuModal
        isOpen={isOpen}
        handleClose={handleOnOpenClick}
        list={notifications}
        handleClearNotif={handleClick}
      />
    </Container>
  );
}

export default NotificationMobile;

NotificationMobile.propTypes = {
  notifications: PropTypes.array,
  handleClick: PropTypes.func,
};
