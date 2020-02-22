/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PageInternalError from "./general/PageInternalError";
import PropTypes from "prop-types";
import Url from "url";

function Home(props) {

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(0);

  const style = css`
    margin: 0;
  `;

  useEffect(() => {
    async function fetchLogin() {
      setLoading(true);

      // TODO: We should use the `url` module to parse the query string instead
      // of geting substrings of `props.location.search`. This method is safer
      // in case there are existing (or future) API routes that takes in queries.
      try {
        // retrieve the query string from the address bar and parse the queries
        // in the string to an object
        const queryObj = Url.parse(props.location.search, true).query;
        // retrieve access token from the query
        const accessToken = queryObj.accessToken;

        // TODO (maybe): Rename it to something shorter, probably "REACT" for
        // React Server and "API" for API server?
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        let getUrl = `http://${server}`;

        // safely parse the request URL into object and add access token to the
        // query string (in case URL has existing queries)
        const parsedGetUrl = Url.parse(getUrl, true);
        if (accessToken) {
          parsedGetUrl.query.accessToken = accessToken;
        }

        // get the final URL used in the request
        getUrl = Url.format(parsedGetUrl);
        console.log("getUrl =", getUrl);

        const results = await fetch(getUrl);
        const obj = await results.json();

        if (results.ok) {
          console.log("OK! results =", results);
          console.log("OK! obj =", obj);
          alert("WWTSLWWFWDT?");
        } else if (results.status === 401) {
          console.log("Not authenticated! results =", results);
          console.log("Not authenticated! obj =", obj);

          // redirect to ONID login
          window.location.href = Url.format({
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
              service: Url.format({
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
        setPageError(500);
      }

      setLoading(false);
    }

    fetchLogin();
  }, [props.history]);

  if (!pageError) {
    return (
      <div id={"page-container"} css={style}>
        <PageSpinner loading={loading} />
      </div>
    );
  } else {
    return <PageInternalError />;
  }

}
export default withRouter(Home);

Home.propTypes = {
  history: PropTypes.object
};
