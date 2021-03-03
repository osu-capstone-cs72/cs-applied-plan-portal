/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import React from "react";

const ListItem = styled(Link)`
  display: block;
  text-decoration: none;
  font-size: 16px;
  margin-bottom: 1rem;
  color: #333;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 10px;
  padding: 1rem 2rem;
`;
const PlanName = styled.div`
  font-weight: 600;
`;

const ModalTitle = styled.h3`
  margin: 1rem 2.3rem;
  /* color: black; */
`;

const StudentName = styled.div`
  margin-left: 2rem;
`;

function HistoryMenuModal({ isOpen, handleClose, list }) {
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
      background-color: #eee;
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

    .history-container {
      padding: 1rem 2rem;
      font-size: 16px;
    }
  `;

  if (!isOpen) {
    return null;
  }

  function ListItems({ list }) {
    if (list.length === 0) {
      return <div className="history-container">No recent history</div>;
    } else {
      return (
        <React.Fragment>
          <ModalTitle>History</ModalTitle>
          <ul className="history-container">
            {list.map((item, index) => (
              <ListItem key={item.planId} to={`/viewPlan/${item.planId}`}>
                <PlanName>{item.planName}</PlanName>
                <StudentName>{`${item.firstName} ${item.lastName}`}</StudentName>
              </ListItem>
            ))}
          </ul>
        </React.Fragment>
      );
    }
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
        {console.log(list)}
        <ListItems list={list} />
      </div>
    </div>,
    document.getElementById("history-portal")
  );
}

export default HistoryMenuModal;
