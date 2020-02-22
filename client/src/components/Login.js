/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PageInternalError from "./general/PageInternalError";
import AuthService from "./AuthService";
import PropTypes from "prop-types";
import url from "url";

function Login(props) {

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(0);

  const style = css`
    margin: 0;
  `;

  useEffect(() => {

    async function useTicket() {

    };

    async function getAccessToken() {

    }

    async function fetchLogin() {
      setLoading(true);

      try {

        // retrieve the query string from the address bar and parse the queries
        // in the string to an object
        const queryObj = url.parse(props.location.search, true).query;

        // retrieve access token from the query
        const accessToken = queryObj.accessToken;

        // set the base url for our request
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        let getUrl = `http://${server}`;

        // Add access token to url
        const parsedGetUrl = url.parse(getUrl, true);
        if (accessToken) {
          parsedGetUrl.query.accessToken = accessToken;
        }

        // get the final URL used in the request
        getUrl = url.format(parsedGetUrl);

        // check if access token is valid
        const results = await fetch(getUrl);
        const obj = await results.json();

        if (results.ok) {

          // save the token and return to the homepage
          // save token
          alert("IT WORKS");
          // props.history.push("/");

        } else if (results.status === 401) {
          console.log("Not authenticated! results =", results);
          console.log("Not authenticated! obj =", obj);

          alert("BAD TOKEN", results);

          // redirect to ONID login
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

    fetchLogin();

  }, []);

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
