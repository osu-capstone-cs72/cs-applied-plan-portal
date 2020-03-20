// File: format.js
// Description: handles formatting for various data types

// takes an array and removes empty strings from it
function formatStringArray(stringArray) {

  return stringArray.filter(value => value !== "");

}
exports.formatStringArray = formatStringArray;

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
