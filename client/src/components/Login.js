/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PageInternalError from "./general/PageInternalError";
import PropTypes from "prop-types";
import url from "url";

function Login(props) {

  const [redirect, setRedirect] = useState(0);
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

        // retrieve access token from the query
        const accessToken = queryObj.accessToken;

        // set the base url for our request
        let getUrl = `/user/authenticated/`;

        // Add access token to url
        const parsedGetUrl = url.parse(getUrl, true);
        if (accessToken) {
          parsedGetUrl.query.accessToken = accessToken;
        }

        // get the final URL used in the request
        getUrl = url.format(parsedGetUrl);
        console.log(getUrl);

        // check if access token is valid
        const results = await fetch(getUrl);

        if (results.ok) {

          // return to the homepage
          setRedirect(1);

        } else if (results.status === 401 || results.status === 404) {

          // redirect to ONID login
          setRedirect(2);

        } else {
          throw Error(`Error code ${results.status}`);
        }
      } catch (err) {
        // send to 500 page if we have a server error while trying to login
        setPageError(500);
      }
      setLoading(false);
    }

    function redirectUrl(target) {
      if (target === 1) {
        props.history.push("/");
      } else if (target === 2) {
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        window.location.href = url.format({
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
                target: "http://localhost:3000/login"
              }
            })
          }
        });
      }
    }

    if (!redirect) {
      fetchLogin();
    } else {
      redirectUrl(redirect);
    }

    // eslint-disable-next-line
  }, [redirect]);

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
export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object
};
