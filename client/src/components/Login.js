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

    // attempt to login and then redirect based on results
    async function fetchLogin() {

      setLoading(true);

      try {

        // attempt to login
        const results = await fetch(`/api/user/authenticated/`);

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
