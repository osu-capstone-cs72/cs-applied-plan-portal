/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { withRouter } from "react-router-dom";
import SelectRole from "../SelectRole";
import PropTypes from "prop-types";
import LoadMoreButton from "../../general/LoadMoreButton";
import SearchResultsMobileCard from "./SearchResultsMobileCard";

const Container = styled.div``;

const ListContainerUl = styled.ul`
  padding: 0;
`;

const ErrorMessage = styled.h3`
  text-align: center;
  margin-top: 4rem;
`;

// search results for a user search
function SearchResults({ props }) {
  if (props.users.length) {
    return (
      <Container>
        <h3 style={{ marginLeft: "1.5rem" }}>Search Results</h3>
        <ListContainerUl>
          {props.users.map((user, index) => (
            <li key={user.userId}>
              <SearchResultsMobileCard
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                onLoading={props.onLoading}
                userId={user.userId}
                index={index}
                role={user.role}
              />
            </li>
          ))}
        </ListContainerUl>

        {props.cursor.primary === "null" ? null : (
          <LoadMoreButton
            onUpdate={() => props.onLoadMore(props.cursor)}
            loading={props.loading}
          />
        )}
      </Container>
    );
  } else {
    return (
      <Container>
        {props.error !== "" && <ErrorMessage>{props.error}</ErrorMessage>}
      </Container>
    );
  }
}
export default withRouter(SearchResults);

SearchResults.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  history: PropTypes.object,
  users: PropTypes.array,
  cursor: PropTypes.object,
  onLoadMore: PropTypes.func,
  onLoading: PropTypes.func,
};
