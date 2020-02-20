/** @jsx jsx */

import PageSpinner from "./general/PageSpinner";
import {useEffect, useState} from "react";
import {css, jsx} from "@emotion/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

function Home(props) {

  const [loading, setLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(0);

  const style = css`
    margin: 0;
  `;

  useEffect(() => {
    fetchLogin();
  }, [props.history]);

  async function fetchLogin() {
    try {
      setLoading(true);
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
        console.log("logged in");
      }

    } catch (err) {
      // send to 500 page if we have a server error while trying to login
      console.log("An internal server error occurred. Please try again later.");
    }
    setLoading(false);
  }

  return (
    <div page-container css={style}>
      <PageSpinner loading={loading} />
    </div>
  );
}
export default withRouter(Home);

Home.propTypes = {
  history: PropTypes.object
};