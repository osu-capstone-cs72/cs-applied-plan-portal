// File: format.js
// Description: handles formating for various datatypes

// takes a string and makes it uppercase and free of white space
module.exports = function formatString(string) {

  return string.toUpperCase().replace(/\s+/g, "");

};

// takes an array of strings and makes them uppercase, free of white space,
// and removes empty strings from the array
module.exports = function formatStringArray(stringArray) {

  return stringArray
    .map(string => string.toUpperCase().replace(/\s+/g, ""))
    .filter(value => value !== "");

};
