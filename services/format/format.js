// File: format.js
// Description: handles formating for various datatypes

// takes an array of strings and makes them uppercase, free of white space,
// removes empty strings, and non-string values from the array
function formatStringArray(stringArray) {

  return stringArray
    .filter(value => value !== "" && typeof value === "string")
    .map(string => string.toUpperCase().replace(/\s+/g, ""));

}
exports.formatStringArray = formatStringArray;
