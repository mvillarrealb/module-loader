"use strict"
const division = function(a,b) {
  if(b == 0) {
    throw "Cannot divide by cero";
  }
  return a / b;
}

module.exports = division;
