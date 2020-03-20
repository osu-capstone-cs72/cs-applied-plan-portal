// File: format.js
// Description: handles formatting for various data types

// takes an array and keep only objects
function formatCourseArray(stringArray) {

  return stringArray
    .filter(course => typeof course === "object" && course !== null);

}
exports.formatCourseArray = formatCourseArray;

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
