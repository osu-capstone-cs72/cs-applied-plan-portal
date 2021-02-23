/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import styled from "@emotion/styled";
import {PropTypes} from "prop-types";
import {useState} from "react";
import HistoryMenuModal from "../head_advisor_nav/HistoryMenuModal";

const Container = styled.div``;
const StyledBtn = styled.button`
  &:hover {
    background: rgba(0, 0, 0, 0.15) !important;
  }
`;
function HistoryHeadAdvMobile({recentPlans}) {

  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpenClick = () => {
    setIsOpen(!isOpen);
  };
  console.log(recentPlans);
  return (
    <Container>
      <StyledBtn onClick={handleOnOpenClick}>History</StyledBtn>
      <HistoryMenuModal
        isOpen={isOpen}
        handleClose={handleOnOpenClick}
        list={recentPlans}
      />
    </Container>
  );
}

export default HistoryHeadAdvMobile;

HistoryHeadAdvMobile.propTypes = {
  recentPlans: PropTypes.array,
};
