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
        sendTicket(props.location.search);
      }
    }

    async function sendTicket(ticket) {
      setLoading(true);
      try {
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const getUrl = `http://${server}/user/login${ticket}`;

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
        const getUrl = `http://${server}/login`;
        let obj = {};

        const results = await fetch(getUrl);
        obj = await results.json();
        console.log(obj);
        if (!obj.authenticated) {
          window.location.href = `${process.env.REACT_APP_AUTHENTICATION_URL}`;
          console.log("go to url");
        } else {
          console.log("already logged in");
        }

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