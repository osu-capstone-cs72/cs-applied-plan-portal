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

// get the plan
function submitPlan(courseCode) {

  const postRequest = new XMLHttpRequest();
  const postURL = `/plan/${courseCode}`;
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

	  // THERE IS A LOT OF DATA RETURNED (Try planID 308)
	  // Here is an example of how to get three different kinds of data...
	  console.log("Basic plan data:\n", obj[0][0].planId, obj[0][0].planName, obj[0][0].lastUpdated);
	  console.log("Course data:\n", obj[1][0].courseName, obj[1][0].courseCode, obj[1][0].credits);
	  console.log(obj[1][1].courseName, obj[1][1].courseCode, obj[1][1].credits);
	  console.log("Review data:\n", obj[2][0].newStatus, obj[2][0].timeReviewed, obj[2][0].note);

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
