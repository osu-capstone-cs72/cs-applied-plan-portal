/** @jsx jsx */

import NavBar from "../Navbar";
import PageSpinner from "../general/PageSpinner";
import {useEffect, useState} from "react";
import {getToken} from "../../utils/authService";
import RecentPlans from "./RecentPlans";
import FindPlans from "./FindPlans";
import SearchResults from "./SearchResults";
import PageInternalError from "../general/PageInternalError";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function AdvisorHome() {

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentPlans, setRecentPlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchFields, setSearchFields] = useState({
    textValue: "*",
    searchValue: 0,
    statusValue: 0,
    sortValue: 0,
    orderValue: 0
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

  useEffect(() => {
    getRecentPlans();
  }, []);

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

  async function searchPlans(page) {
    try {
      setErrorMessage("");
      setLoading(true);

      const text = document.getElementById("input-search");
      let textValue = text.value;
      if (textValue === "") {
        textValue = "*";
      }

      const search = document.getElementById("select-search");
      let searchValue = search.options[search.selectedIndex].value;

      const status = document.getElementById("select-status");
      let statusValue = status.options[status.selectedIndex].value;

      const sort = document.getElementById("select-sort");
      let sortValue = sort.options[sort.selectedIndex].value;

      const order = document.getElementById("select-order");
      let orderValue = order.options[order.selectedIndex].value;

      // don't use search fields if we are just showing other pages of our results
      if (page > 1) {
        searchValue = searchFields.searchValue;
        statusValue = searchFields.statusValue;
        sortValue = searchFields.sortValue;
        orderValue = searchFields.orderValue;
      } else {
        setSearchFields({
          searchValue: searchValue,
          statusValue: statusValue,
          sortValue: sortValue,
          orderValue: orderValue
        });
      }

      const token = getToken();
      const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
      const getUrl = `http://${server}/plan/search/${textValue}/${searchValue}/${statusValue}/` +
        `${sortValue}/${orderValue}/${page}/?accessToken=${token}`;
      let obj = {};

      // get our search results
      const results = await fetch(getUrl);
      setLoading(false);
      if (results.ok) {

        // if this is a new search clear all of the previous results
        obj = await results.json();
        if (page > 1) {
          setPlans([...plans, ...obj.plans]);
        } else {
          setPlans([...obj.plans]);
        }
        setPageNumber(obj.page);
        setTotalPages(obj.totalPages);

      } else {
        // we got a bad status code. Show the error
        obj = await results.json();
        setErrorMessage(obj.error);
        if (results.status === 500) {
          setErrorMessage("An internal server error occurred. Please try again later.");
        }
      }
    } catch (err) {
      // show error message if error while searching
      setErrorMessage("An internal server error occurred. Please try again later.");
    }
  }

  if (!pageError) {
    return (
      <div css={style}>
        <PageSpinner loading={loading} />
        <NavBar />
        <div id="advisor-home-container">
          <div id="advisor-home-contents-container">

            {recentPlans.length ? (
              <RecentPlans recentPlans={recentPlans}/>
            ) : (
              null
            )}

            <FindPlans onSearch={(e) => searchPlans(e)}/>

            <div className="home-error-message-container">{errorMessage}</div>

            {plans.length ? (
              <SearchResults plans={plans} pageNumber={pageNumber} totalPages={totalPages}
                onLoadMore={(e) => searchPlans(e)} />
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