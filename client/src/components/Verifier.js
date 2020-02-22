/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PageInternalError from "./general/PageInternalError";
import StudentHome from "./StudentHome";
import AdvisorHome from "./AdvisorHome";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import url from "url";

function Verifier(props) {

  // const [token, setToken] = useState({});
  const [homeState, setHomeState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(0);

  const style = css`
    margin: 0;
  `;

  useEffect(() => {
    async function fetchLogin() {
      setLoading(true);

      try {
        // retrieve the query string from the address bar and parse the queries
        // in the string to an object
        const queryObj = url.parse(props.location.search, true).query;
        console.log(queryObj);

        // retrieve access token from the query
        const accessToken = queryObj.accessToken;

        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        let getUrl = `http://${server}`;

        // safely parse the request URL into object and add access token to the
        // query string (in case URL has existing queries)
        const parsedGetUrl = url.parse(getUrl, true);
        if (accessToken) {
          parsedGetUrl.query.accessToken = accessToken;
        }

        // get the final URL used in the request
        getUrl = url.format(parsedGetUrl);
        console.log("getUrl =", getUrl);


        const results = await fetch(getUrl);
        const obj = await results.json();

        if (results.ok) {

          // render the correct homepage
          const payloadObj = jwtDecode(accessToken);
          if (payloadObj.role) {
            setHomeState(2);
          } else {
            setHomeState(1);
          }

        } else if (results.status === 401) {
          console.log("Not authenticated! results =", results);
          console.log("Not authenticated! obj =", obj);

          // redirect to ONID login
          window.location.href = url.format({
            // TODO: Put this in a global function that receives on the `target`
            // param that defines the final URL that the API should redirect to
            // on a successful login.
            // Note: When dealing with URLs, it's best to use the `url` module
            // to format and parse them.
            protocol: "https",
            hostname: "login.oregonstate.edu",
            pathname: "/idp-dev/profile/cas/login",
            // callback URL for CAS
            query: {
              service: url.format({
                protocol: "http",
                host: server,
                pathname: "/user/login",
                // callback URL has its own query string
                query: {
                  target: "http://localhost:3000"
                }
              })
            }
          });
        } else {
          throw Error("Unspecified error: results =", results);
        }
      } catch (err) {
        // send to 500 page if we have a server error while trying to login
        console.log(err);
        setPageError(500);
      }

      setLoading(false);
    }

    if (!homeState) {
      fetchLogin();
    }

  }, [props.history, props.location.search, props.location.accessToken, homeState]);

  if (pageError) {
    return <PageInternalError />;
  } else if (homeState === 1) {
    return <StudentHome />;
  } else if (homeState === 2) {
    return <AdvisorHome />;
  } else {
    return (
      <div id={"page-container"} css={style}>
        <PageSpinner loading={loading} />
      </div>
    );
  }

}
export default withRouter(Verifier);

Verifier.propTypes = {
  history: PropTypes.object
};
