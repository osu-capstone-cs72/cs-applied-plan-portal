import React from "react";
import styled from "@emotion/styled";
import { BOX_SHADOW_CARD, MOBILE_WIDTH } from "../../../utils/constants";
import SelectRole from "../SelectRole";

const Container = styled.div`
  width: ${MOBILE_WIDTH};
  box-shadow: ${BOX_SHADOW_CARD};
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 5px;
`;

const CartItem = styled.div`
  margin-bottom: 0.4rem;
`;

const Title = styled.span`
  font-weight: 600;
`;

const Text = styled.span`
  font-weight: 400;
`;

function SearchResultsMobileCard({
  userId,
  firstName,
  lastName,
  email,
  role,
  index,
  onLoading,
}) {
  return (
    <Container>
      <CartItem>
        <Title>User Name: </Title>
        <Text>{`${firstName} ${lastName}`}</Text>
      </CartItem>

      <CartItem>
        <Title>User ID: </Title>
        <Text>{`${userId}`}</Text>
      </CartItem>
      <CartItem>
        <Title>Email: </Title>
        <Text>{`${email}`}</Text>
      </CartItem>
      <CartItem>
        <SelectRole
          role={role}
          userId={userId}
          index={index}
          userName={firstName + " " + lastName}
          onLoading={(load) => onLoading(load)}
        />
      </CartItem>
    </Container>
  );
}

export default SearchResultsMobileCard;
