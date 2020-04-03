// File: format.js
// Description: handles formatting for various data types

// takes an array and keep only objects while sorting by course ID
function formatCourseArray(stringArray) {

  return stringArray
    .filter(course => typeof course === "object" && course !== null)
    .sort((a, b) => a.courseId - b.courseId);

}
exports.formatCourseArray = formatCourseArray;

// takes a status number and returns a status string
function formatStatus(status) {
  switch (status) {
    case 0:
      return "Rejected";
    case 1:
      return "Awaiting student changes";
    case 2:
      return "Awaiting review";
    case 3:
      return "Awaiting final review";
    case 4:
      return "Accepted";
    default:
      return "";
  }
}
exports.formatStatus = formatStatus;
