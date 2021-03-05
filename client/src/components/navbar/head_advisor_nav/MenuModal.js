/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import {CSSTransition} from "react-transition-group";
import {Link} from "react-router-dom";
import styled from "@emotion/styled";

const ListItem = styled(Link)`
  display: block;
  text-decoration: none;
  font-size: 16px;
  margin-bottom: 1rem;
  color: #333;
`;


function MenuModal({isOpen, handleClose, list, handleClearNotif}) {
  const style = css`
    & {
      position: fixed;
      left: 0;
      right: 0;
      z-index: 2000;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .modal-content {
      width: 80%;
      height: 100%;
      margin: auto;
      display: flex;
      flex-direction: column;
      /* animation: slideInRight;
      animation-duration: 0.60s; */
    }
    .modal-item {
      font-size: 24px;
    }
    .close-window-icon {
      margin: 2rem;
      align-self: flex-end;
    }
    .my-node-enter {
      opacity: 0;
    }
    .my-node-enter-active {
      opacity: 1;
      transition: opacity 1000ms;
    }
    .my-node-exit {
      opacity: 1;
    }
    .my-node-exit-active {
      opacity: 0;
      transition: opacity 1000ms;
    }

    /* ///// Custom CSS */

    .notification-container {
      padding: 1rem 2rem;
      font-size: 16px;
    }

  `;

  if (!isOpen) {
    return null;
  }

  function ListItems({list, handleClearNotif}) {
    if (list.length === 0) {
      return (
        <div className='notification-container'>
          No new notifications
        </div>
      );
    } else {
      return (
        <ul className="notification-container">
          {list.map((item, index) => (
            <ListItem
              key={item.notificationId}
              to={`/viewPlan/${item.planId}`}
              onClick={(event) => handleClearNotif(event, item, index)}
            >
              {item.text}
            </ListItem>
          ))}
        </ul>
      );
    }
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={isOpen}
      timeout={1000}
      unmountOnExit
      classNames="my-node"
    >
      <div className="menu-modal" css={style}>
        <div className="modal-content">
          <FontAwesomeIcon
            icon={faTimes}
            size="lg"
            className="close-window-icon"
            onClick={handleClose}
          />
          <ListItems list={list} handleClearNotif={handleClearNotif} />
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("notification-portal")
  );

}

export default MenuModal;
