import React from "react";
import styled from "@emotion/styled";
import {PropTypes} from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  margin: 0 5px;
  display: inline-block;
  color: white;
`;

const Count = styled.span``;

function Badge({list}) {
  return (
    <Container>
      <Count>{list.length ? list.length : null}</Count>
      <FontAwesomeIcon icon={faCaretDown}/>
    </Container>
  );
}

export default Badge;

Badge.propTypes = {
  list: PropTypes.array
};