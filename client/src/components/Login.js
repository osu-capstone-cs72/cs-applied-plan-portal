/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PageInternalError from "./general/PageInternalError";
import PropTypes from "prop-types";
import {login} from "../utils/authService";

function Login() {

  const [redirect, setRedirect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(0);

  useEffect(() => {

    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    // attempt to login and then redirect based on results
    async function fetchLogin() {

      setLoading(true);

      try {

        // attempt to login
        const results = await fetch(`/api/user/authenticated/`);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {

          if (results.ok) {

            // return to the homepage
            setRedirect(1);

          } else if (results.status === 401 || results.status === 404) {

            // redirect to ONID login
            setRedirect(2);

          } else {
            throw Error(`Error code ${results.status}`);
          }

          setLoading(false);

        }

      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          // send to 500 page if we have a server error while trying to login
          setPageError(500);
        }
      }

    }

    // redirect to a different page
    function redirectUrl(target) {

      if (target === 1) {
        // redirect to homepage
        document.location.href = "../";
      } else if (target === 2) {
        // redirect to OSU login page
        login();
      }

    }

    // check to see if we need to redirect to another page
    if (!redirect) {
      fetchLogin();
    } else {
      redirectUrl(redirect);
    }

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, [redirect]);

  if (!pageError) {
    return (
      <div id={"page-container"}>
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
