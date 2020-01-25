// File: format.js
// Description: handles formating for various datatypes

// takes an array of strings and makes them uppercase, free of white space,
// and removes empty strings from the array
module.exports = function formatStringArray(stringArray) {

  return stringArray
    .map(string => string.toUpperCase().replace(/\s+/g, ""))
    .filter(value => value !== "");

};
