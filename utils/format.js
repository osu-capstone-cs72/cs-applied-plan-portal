// File: format.js
// Description: handles formating for various datatypes

// ensures that a string has a length of at least one
function noEmptyString(string) {

  if (string.length === 0) {
    string = "0";
  }
  return string;

}
exports.noEmptyString = noEmptyString;

// takes a string and makes it uppercase and free of white space
function formatString(string) {

  return string.toUpperCase().replace(/\s+/g, "");

}
exports.formatString = formatString;

// takes an array of strings and makes them uppercase, free of white space,
// and removes empty strings from the array
function formatStringArray(stringArray) {

  return stringArray
    .map(string => string.toUpperCase().replace(/\s+/g, ""))
    .filter(value => value !== "");

}
exports.formatStringArray = formatStringArray;
