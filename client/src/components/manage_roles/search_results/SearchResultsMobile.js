/** @jsx jsx */

// import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled"
import { withRouter } from "react-router-dom";
import SelectRole from "../SelectRole";
import PropTypes from "prop-types";
import LoadMoreButton from "../../general/LoadMoreButton";

const Container = styled.div`

`

// search results for a user search
function SearchResults({ props }) {

  if (props.users.length) {
    return (
      <div className="table-container" css={style}>
        <h3>Search Results</h3>
        {/* {props.users.map((user, index) =>
              <tr key={user.userId}>
                <td className="user-data" key={user.userId + "a"}>
                  {user.firstName + " " + user.lastName}
                </td>
                <td className="user-data" key={user.userId + "b"}>{user.userId}</td>
                <td className="user-data" key={user.userId + "c"}>{user.email}</td>
                <td className="user-data" key={user.userId + "d"}>
                  <SelectRole role={user.role} userId={user.userId} index={index}
                    userName={user.firstName + " " + user.lastName} onLoading={load => props.onLoading(load)} />
                </td>
              </tr>
            )} */}

        {props.cursor.primary === "null" ? (
          null
        ) : (
            <LoadMoreButton onUpdate={() => props.onLoadMore(props.cursor)}
              loading={props.loading} />
          )}
      </div>
    );
  } else {
    return (
      <div css={style}>
        <div className="prompt-container">
          {props.error === "" ? (
            <h3>Search for users...</h3>
          ) : (
              <h3>{props.error}</h3>
            )}
        </div>
      </div>
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
  onLoading: PropTypes.func
};