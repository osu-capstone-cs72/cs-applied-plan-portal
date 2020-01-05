console.log("JavaScript start");

// define variable for the "Submit Plan" button
var submitButton = document.getElementById('submit-button');

// define variables for the input text values
var userId, planName, course1, course2, course3, course4, course5, course6, course7,
course8, course9, course10, course11 = "";

// assign all of the input values to variables
function getInputs() {
    userId = document.getElementById('user-id').value;
    planName = document.getElementById('plan-name').value;
    course1 = document.getElementById('course-1').value;
    course2 = document.getElementById('course-2').value;
    course3 = document.getElementById('course-3').value;
    course4 = document.getElementById('course-4').value;
    course5 = document.getElementById('course-5').value;
    course6 = document.getElementById('course-6').value;
    course7 = document.getElementById('course-7').value;
    course8 = document.getElementById('course-8').value;
    course9 = document.getElementById('course-9').value;
    course10 = document.getElementById('course-10').value;
    course11 = document.getElementById('course-11').value;
    course12 = document.getElementById('course-12').value;
}

// clear all of the input fields for the form
function clearInputs() {
    document.getElementById('plan-form').reset();
}

// submit the users plan
function submitPlan(userId, planName, course1, course2, course3, course4,
    course5, course6, course7, course8, course9, course10, course11, course12) {

    var postRequest = new XMLHttpRequest();
    var postURL = "/appliedplanportal/form";
    postRequest.open('POST', postURL);

    var postObj = {
        userId: userId,
        planName: planName,
        course1: course1,
        course2: course2,
        course3: course3,
        course4: course4,
        course5: course5,
        course6: course6,
        course7: course7,
        course8: course8,
        course9: course9,
        course10: course10,
        course11: course11,
        course12: course12
    };

    var requestBody = JSON.stringify(postObj);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
        if (event.target.status !== 200) {
            alert("Error storing plan in database:\n" + event.target.response);
        } else {
            console.log("Plan submitted");
        }
    });

    postRequest.send(requestBody);
    console.log("postRequest:", requestBody);
}

// user clicks on the "Submit Plan" button
submitButton.addEventListener("click", function(e) {
    console.log("Submit button pressed");
    getInputs();
    submitPlan(userId, planName, course1, course2, course3, course4, course5,
        course6, course7, course8, course9, course10, course11, course12);
    clearInputs();
});

// update select to include new options
function updateSelect(newOptions) {}
