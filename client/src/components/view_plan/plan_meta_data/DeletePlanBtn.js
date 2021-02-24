import React from 'react'
import styled from '@emotion/styled';


const Container = styled.div`
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 55px;
      word-wrap: break-word;
      flex-grow: 1;
`
const StyledButton = styled.button`
  padding: 10px;
`

function DeletePlanBtn({ status, onDelete }) {
  return (
    <>
      {status === 1 || status === 2 ? (
        <Container>
          <StyledButton onClick={() => onDelete()}>
            Delete Plan
          </StyledButton>
        </Container>
      ) : (null)}

    </>
  )
}

export default DeletePlanBtn
