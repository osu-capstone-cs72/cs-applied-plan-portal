console.log("JavaScript start");

// define constant for the "Submit Plan" button
const submitButton = document.getElementById("submit-button");

// define variables for the input text values
let courseCode = "";

// assign all of the form text values to variables
function getInputs() {
  courseCode = document.getElementById("course-code").value;
}

// clear all of the input text fields of the form
function clearInputs() {
  document.getElementById("plan-form").reset();
}

// submit the users plan
function submitPlan(courseCode) {

  const postRequest = new XMLHttpRequest();
  const postURL = `/plan/${courseCode}/comment`;
  postRequest.open("GET", postURL);
  console.log(postURL);

  postRequest.setRequestHeader("Content-Type", "application/json");

  postRequest.addEventListener("load", (event) => {
    if (event.target.status !== 200) {
      alert("Error submitting plan:\n" + event.target.response);
    } else {
      alert("Response:\n" + event.target.response);

      // turn the result into an object
      const obj = JSON.parse(event.target.response);

      // if I want to access some data from the first result...
      console.log(obj[0].credits, obj[0].courseName, obj[0].courseCode);

      clearInputs();
    }
  });

  postRequest.send();
}

// user clicks on the "Submit Plan" button
submitButton.addEventListener("click", () => {
  console.log("Submit button pressed");
  getInputs();
  submitPlan(courseCode);
});
