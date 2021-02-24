import React from 'react'
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Desktop, Mobile } from '../../../utils/responsiveUI';

const Container = styled.div`
`

const StyledLink = styled(Link)`
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
            <Desktop>
              <StyledButton>
                Edit Plan
            </StyledButton>
            </Desktop>
            <Mobile>
              <FontAwesomeIcon icon={faEdit} style={{
                color: `var(--color-edit)`,
                fontSize: '2.5rem',
                margin: '1rem',
                marginRight: '2rem'
              }} />
            </Mobile>
          </StyledLink>
        </Container>
      ) : (null)}
    </>
  )
}

export default EditPlanBtn
