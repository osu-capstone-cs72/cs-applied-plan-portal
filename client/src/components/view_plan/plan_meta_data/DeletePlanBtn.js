import React from 'react'
import styled from '@emotion/styled';
import { Desktop, Mobile } from '../../../utils/responsiveUI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  margin-left: 10px;
`
const StyledButton = styled.button`
  padding: 10px;
`

function DeletePlanBtn({ status, onDelete }) {
  return (
    <>

      {status === 1 || status === 2 ? (
        <>
          <Container>
            <Desktop>
              <StyledButton onClick={() => onDelete()}>
                Delete Plan
          </StyledButton>
            </Desktop>
            <Mobile>
              <FontAwesomeIcon
                icon={faTrashAlt}
                style={{
                  color: `var(--color-delete)`,
                  fontSize: '2.5rem'
                }}
                onClick={() => onDelete()} />
            </Mobile>
          </Container>
        </>
      ) : (null)}

    </>
  )
}

export default DeletePlanBtn
