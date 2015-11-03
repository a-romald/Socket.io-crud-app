//Function to check emptyObject in NodeJS
//This should work in node.js and other ES5 compliant implementations.
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}


module.exports = isEmptyObject;