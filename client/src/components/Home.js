/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PageInternalError from "./general/PageInternalError";
import PropTypes from "prop-types";

function Home(props) {

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(0);

  const style = css`
    margin: 0;
  `;

  useEffect(() => {

    async function checkTicket() {
      // attempt to login if we don't already have a ticket
      if (props.location.search === "") {
        fetchLogin();
      } else {
        // since we have a ticket we should send it to the API server
        sendTicket(props.location.search.substring(1));
      }
    }

    async function sendTicket(ticket) {
      setLoading(true);
      try {
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const getUrl = `http://${server}/user/login?target=/&${ticket}`;
        console.log(getUrl);

        const results = await fetch(getUrl);
        const obj = await results.json();

        // do something based on the response from the API server
        console.log("TICKET RESPONSE FROM API\n", obj);

      } catch (err) {
        // send to 500 page if we have a server error while trying to send ticket
        setPageError(500);
      }
      setLoading(false);
    }

    async function fetchLogin() {
      setLoading(true);
      try {
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const getUrl = `http://${server}`;

        const results = await fetch(getUrl);
        const obj = await results.json();

        if (results.ok) {
          console.log("OK! results =", results);
          console.log("OK! obj =", obj);
        } else if (results.status === 401) {
          console.log("Not authenticated! results =", results);
          console.log("Not authenticated! obj =", obj);

          window.location.href = `https://login.oregonstate.edu/idp-dev/profile/cas/login?service=http://${server}/user/login?target=http://localhost:5000/`;
        } else {
          throw Error("Unspecified error: results =", results);
        }
        // if (!obj.authenticated) {
        //   const newUserId = 82757579527;
        //   // window.location.href = `https://login.oregonstate.edu/idp-dev/profile/cas/login?service=http://localhost:5000/user/login?target=/user/${newUserId}/plans`;
        //   window.location.href = "https://login.oregonstate.edu/idp-dev/profile/cas/login?service=http://localhost:3000/";
        //   // window.location.href = `${process.env.REACT_APP_AUTHENTICATION_URL}`;
        //   console.log("go to url");
        // } else {
        //   console.log("already logged in");
        // }

      } catch (err) {
        // send to 500 page if we have a server error while trying to login
        setPageError(500);
      }
      setLoading(false);
    }

    checkTicket();

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
