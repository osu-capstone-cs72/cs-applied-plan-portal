/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";

function MenuModal({isOpen, handleClose}) {
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
      animation: slideInRight;
      animation-duration: 0.60s;
    }
    .modal-item {
      font-size: 24px;
    }
    .close-window-icon {
      margin: 2rem;
      align-self: flex-end;
    }
  `;
  if (!isOpen) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className="menu-modal" css={style}>
      <div className="modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          size="lg"
          className="close-window-icon"
          onClick={handleClose}
        />
        <ul>
          <li className="modal-item">Item 1</li>
          <li className="modal-item">Item 2</li>
          <li className="modal-item">Item 3</li>
          <li className="modal-item">Item 4</li>
          <li className="modal-item">Item 5</li>
        </ul>
      </div>
    </div>,
    document.getElementById("portal")
  );

}

export default MenuModal;
