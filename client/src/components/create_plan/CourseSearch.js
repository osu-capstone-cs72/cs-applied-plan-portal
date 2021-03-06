/** @jsx jsx */

import {useEffect, useState} from "react";
import Course from "./Course";
import FilterBar from "./FilterBar";
import ErrorMessage from "../general/ErrorMessage";
import PropTypes, { func } from "prop-types";
import {css, jsx} from "@emotion/core";
import { Mobile,Desktop } from "../../utils/responsiveUI";
import {SCREENWIDTH} from "../../utils/constants";
import Modal from 'react-modal';


Modal.setAppElement('#root')

// search form for courses
function CourseContainer(props) {

  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("*");
  const [request, setRequest] = useState("*");

  const [modalIsOpen, setIsOpen] = useState(false);
  const width = SCREENWIDTH.MOBILE.MAX; 

  // modal css styles
  const ModalStyles = {
  overlay:{
    background          :  "rgba(0, 0, 0, 0.5)"
  },
  content : {
    position             : "relative",
    inset                : "103px 0px 0px 0px",
    border               : "1px solid transparent",
    background           :  "transparent",
    margin               : "0px",
    padding              : "0px",
    height               : "80vh",
    borderRadius         : "0px",
    overflow             : "visible"
  },
  button : {
    background            : "#e7501c",
    position              : "relative",
    top                   : "-3vh",
    border                : "1px solid transparent",
    borderRadius          : "6px",
    color                 : "white",
    fontSize              : "3rem",
    padding               : "0px 10px",
    margin                : "1% 4%",
    float                 : "right"
  },
  fontOfButton : {
    position              : "relative",
    top                   : "-14%"
  },
  resultTable : {
    overflow              : "scroll",
    height                : "87%",
    position              : "relative",
    width                 : "93vw",
    margin                : "0 3%"



  },
  errorMessage : {
    position : "relative",
    top : "-4%"
  }
};

  const style = css`

    & {
      display: grid;
      grid-gap: 1rem;
      grid-template-columns: auto auto;
      grid-template-rows: 50px auto auto 1fr;
      grid-template-areas: 'title    category'
                          'search   search'
                          'warn     warn'
                          'results  results';
      @media(max-width: ${width}px){
        grid-template-columns: 96vw;
        grid-template-rows: 40px 43px auto;
        grid-template-areas:
            'filter'
            'search'
            'results';
        grid-gap: 5px;
        position: absolute;
        height: auto;
        padding: 0px 5px 0px 5px;
      }
    }
    
    .search-title {
      font-weight: 600;
      font-size: 23px;
      grid-area: title;
      display: flex;
      align-items: center;
      @media(max-width: ${width}px){
        display: none;
      }
    }
    
    .search-category {
      grid-area: category;
    }
    
    .search-button {
      background: var(--color-orange-500);
      color: var(--color-orange-50);
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
      @media(max-width: ${width}px){
        padding: 0px 12px;
      }
    }
    
    .search-results {
      grid-area: results;
      overflow-x: hidden;
      overflow-y: auto;
      @media(max-width: ${width}px){
        overflow-y: scroll;
        // max-height: 76vh;
      }
    }

    .search-container {
      display: grid;
      grid-template-columns: 3fr 1fr;
      grid-gap: 1rem;
      grid-template-rows: auto;
      grid-area: search;
      @media(max-width: ${width}px){
        grid-template-columns: 4fr auto;
      }
    }
    
    #search-container {
      padding: 2rem 1rem;
      border: 1.5px solid #dfdad8;
      box-shadow: none;
      @media(max-width: ${width}px){
          height: 45px;
      }
    }

    .course-filter {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 0;
    }
    
    .course-filter select {
      text-align-last: right;
      background: none;
      border: none;
      float: right;
      outline: none;
    }

    .course-filter select:focus {
      @media(max-width: ${width}px){
        position: relative;
        top: 155px;
        background:white;
        border-radius: 6px;

      }
    }

    #errorMessage{
       @media(max-width: ${width}px){
         color:red;
       }
    }

    .form {
      display: inline;
    }

    .fas.fa-search{
      font-size: 2.5rem;
    }


  `;

  // listen for new search requests and perform a new search when one arrives
  useEffect(() => {

    // set ignore and controller to prevent a memory leak
    // in the case where we need to abort early
    let ignore = false;
    const controller = new AbortController();

    async function filterSearch() {
      try {
        changeWarning("");

        setCourses([]);
        let value = document.getElementById("search-container").value;
        if (value === "") {
          value = "*";
        }
        const getUrl = `/api/course/search/${value}/${filter}`;
        let obj = [];

        const results = await fetch(getUrl);

        // before checking the results, ensure the request was not canceled
        if (!ignore) {

          if (results.ok) {
            obj = await results.json();
            setCourses(obj.courses);
          } else {
            // we got a bad status code
            obj = await results.json();
            changeWarning(obj.error);
            setCourses([]);
          }

        }

      } catch (err) {
        if (err instanceof DOMException) {
          // if we canceled the fetch request then don't show an error message
          console.log("HTTP request aborted");
        } else {
          changeWarning("An internal server error occurred. Please try again later.");
        }
      }
    }

    // don't load search results on the initial mount
    if (mounted) {
      filterSearch();
    } else {
      setMounted(true);
    }

    // cleanup function
    return () => {
      controller.abort();
      ignore = true;
    };

    // eslint-disable-next-line
  }, [request]);

  // initiates a new course search
  function callSearch() {
    setRequest({
      courses: courses,
      filter: filter
    });
    openModal();
  }

  // if the filter value is changed clear the error field and set the filter
  async function handleFilterChange(value) {
    changeWarning("");
    setFilter(value);
    callSearch();
  }

  // handle mobile filter change
  async function handleFilterChangeMobile(value) {
    changeWarning("");
    setFilter(value);
  }

  // prevent default submit behavior of form elements
  function submitHandler(e) {
    e.preventDefault();
    callSearch();
  }

  // update the error field text
  function changeWarning(text) {
    props.onNewWarning(text);
  }

  // show modal
  function openModal(){
    setIsOpen(true);
  }

  // close modal
  function closeModal(){
    setIsOpen(false);
  }



  return (
    <div id="search" css={style}>
      <div className="search-title">Search</div>
      <div className="search-container">
        <form className="form my-2 my-lg-0" onSubmit={submitHandler}>
          <input id="search-container" className="form-control mr-sm-2" type="text" placeholder="Search for courses..." name="search"/>
        </form>

        <button className="search-button" type="submit" onClick={callSearch}>
          <Desktop>
            Search
          </Desktop>
          <Mobile>
            <i class="fas fa-search"></i>
          </Mobile>
        </button>
      </div>

      <Desktop>
        <form className="course-filter form-group">
          <FilterBar value={filter} onValueChange={handleFilterChange}/>
        </form>
      </Desktop>
      <Mobile>
        <form className="course-filter form-group">
          <FilterBar value={filter} onValueChange={handleFilterChangeMobile}/>
        </form>
      </Mobile>

      <Desktop>
        <ErrorMessage text={props.warning} />
      </Desktop>

      {/* Mobile version for pop up modal for table containing search course result */}
      <Mobile>
        <div className="search-results">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={ModalStyles}
        >
            {/* <div style={ModalStyles.errorMessage}> */}
              
              <button id="closeButton" onClick={closeModal} style={ModalStyles.button}>
                {/* <i class="far fa-times-circle" style={ModalStyles.fontOfButton}></i> */}
                <i class="fas fa-times" style={ModalStyles.fontOfButton}></i>
              </button>
              <ErrorMessage text={props.warning} />
            {/* </div> */}
             


            <div style={ModalStyles.resultTable}>
             
              {courses.length > 0 ? courses.map(c =>
              <Course key={c.courseId} courseId={c.courseId} courseCode={c.courseCode} courseName={c.courseName} credits={c.credits}
                description={c.description} prerequisites={c.prerequisites} restriction={c.restriction} onAddCourse={e => props.onAddCourse(e)}/>
            ) 
            : (
            <Desktop>
              <div>Search for courses...</div>
            </Desktop>
            )}
            </div>
        </Modal>
      </div>
      </Mobile>

      {/* Desktop version for pop up modal for table containing search course result */}
      <Desktop>
        <div className="search-results">
          {courses.length > 0 ? courses.map(c =>
            <Course key={c.courseId} courseId={c.courseId} courseCode={c.courseCode} courseName={c.courseName} credits={c.credits}
              description={c.description} prerequisites={c.prerequisites} restriction={c.restriction} onAddCourse={e => props.onAddCourse(e)}/>
          ) : (
              <div>Search for courses...</div>
          )}
        </div>
      </Desktop>

    </div>
  );

}
export default CourseContainer;

CourseContainer.propTypes = {
  updateCourses: PropTypes.func,
  onAddCourse: PropTypes.func,
  onNewWarning: PropTypes.func,
  warning: PropTypes.string
};