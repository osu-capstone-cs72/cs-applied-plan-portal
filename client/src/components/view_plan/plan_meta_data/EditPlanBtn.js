import React from 'react'
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const Container = styled.div`
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 55px;
      word-wrap: break-word;
      flex-grow: 1;
`

const StyledLink = styled(Link)`
  padding: 10px;
`

const StyledButton = styled.button`
padding: 10px;
`


function EditPlanBtn({ status, planId }) {
  return (
    <>
      {status === 1 || status === 2 ? (
        <Container>
          <StyledLink to={`/editPlan/${planId}`}>
            <StyledButton>
              Edit Plan
            </StyledButton>
          </StyledLink>
        </Container>
      ) : (null)}
    </>
  )
}

export default EditPlanBtn
