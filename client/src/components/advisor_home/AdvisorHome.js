/** @jsx jsx */

import NavBar from "../Navbar";
import PageSpinner from "../general/PageSpinner";
import {useEffect, useState} from "react";
import {getToken} from "../../utils/authService";
import FindPlans from "./FindPlans";
import SearchResults from "./SearchResults";
import PageInternalError from "../general/PageInternalError";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function AdvisorHome() {

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(0);
  const [cursor, setCursor] = useState({
    primary: "null",
    secondary: "null"
  });
  const [recentPlans, setRecentPlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchFields, setSearchFields] = useState({
    textValue: "*",
    statusValue: 5,
    sortValue: 5,
    orderValue: 1
  });

  const style = css`

    #advisor-home-container {
      position: absolute;
      top: 75px;
      margin: 0 auto;
      width: 100%;
    }

    #advisor-home-contents-container {
      margin: 25px auto;
      width: 50%;
    }

    .home-error-message-container {
      text-align: center;
      margin: 0 auto;
    }

  `;

  // get the list of recent plans
  useEffect(() => {
    getRecentPlans();
  }, []);

  // if the sorting order changes perform a new search
  useEffect(() => {
    const newCursor = {
      primary: "null",
      secondary: "null"
    };
    searchPlans(newCursor, false);
    // eslint-disable-next-line
  }, [searchFields.orderValue, searchFields.sortValue]);

  // get the five most recent plans
  async function getRecentPlans() {
    try {
      setErrorMessage("");
      setLoading(true);

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/recent/?accessToken=${token}`;
      let obj = {};

      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {
        obj = await results.json();
        setRecentPlans(obj.plans);
      } else {
        // we got a bad status code.
        obj = await results.json();
        if (results.status === 500) {
          setPageError(500);
        }
      }
    } catch (err) {
      // send to 500 page if a server error happens while fetching plan
      setPageError(500);
    }
  }

  // search for plans using some sorting logic
  async function searchPlans(cursor, newSearch) {
    try {
      setErrorMessage("");
      setLoading(true);
      const sortValue = searchFields.sortValue;
      const orderValue = searchFields.orderValue;

      // get search text from searchbar
      const text = document.getElementById("input-search");
      let textValue = text.value;

      // if search text is empty we use a special char to represent
      // any text response as valid
      if (textValue === "") {
        textValue = "*";
      }

      // get the status from the status select
      const status = document.getElementById("select-status");
      let statusValue = status.options[status.selectedIndex].value;

      // only set the search values if we are performing a new search
      if (newSearch) {
        setSearchFields({
          textValue: textValue,
          statusValue: statusValue,
          sortValue: sortValue,
          orderValue: orderValue
        });
      } else {
        textValue = searchFields.textValue;
        statusValue = searchFields.statusValue;
      }

      // construct the request url
      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/search/${textValue}/${statusValue}/` +
        `${sortValue}/${orderValue}/${cursor.primary}/${cursor.secondary}/?accessToken=${token}`;
      let obj = {};

      // get our search results
      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {

        // if the cursor is new then we will want to relist plans
        obj = await results.json();
        if (cursor.primary === "null") {
          setPlans([...obj.plans]);
        } else {
          setPlans([...plans, ...obj.plans]);
        }
        setCursor(obj.nextCursor);

      } else {
        // we got a bad status code. Show the error
        obj = await results.json();
        setErrorMessage(obj.error);
        if (results.status === 500) {
          setErrorMessage("An internal server error occurred. Please try again later.");
        }
        if (results.status === 404) {
          setPlans([]);
        }
      }
    } catch (err) {
      // show error message if error while searching
      setErrorMessage("An internal server error occurred. Please try again later.");
    }
  }

  // update the sorting rules
  function handleChangeSort(sort, order) {

    setSearchFields ({
      textValue: searchFields.textValue,
      statusValue: searchFields.statusValue,
      sortValue: sort,
      orderValue: order
    });

  }

  if (!pageError) {
    return (
      <div css={style}>
        <PageSpinner loading={loading} />
        <NavBar />
        <div id="advisor-home-container">
          <div id="advisor-home-contents-container">

            <FindPlans onSearch={cursor => searchPlans(cursor, true)}/>

            <div className="home-error-message-container">{errorMessage}</div>

            {plans.length ? (
              <SearchResults plans={plans} cursor={cursor} searchFields={searchFields}
                onChangeSort={(sort, order) => handleChangeSort(sort, order)}
                onLoadMore={cursor => searchPlans(cursor, false)} />
            ) : (
              null
            )}

          </div>
        </div>
      </div>
    );
  } else {
    return <PageInternalError />;
  }
}
export default AdvisorHome;

AdvisorHome.propTypes = {
  history: PropTypes.object
};