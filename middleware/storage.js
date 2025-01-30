"use strict";
const LocalStorage = require("node-localstorage").LocalStorage;
function TokenStorage() {
  this.localStorage;
  if (typeof localStorage === "undefined" || localStorage === null) {
    this.localStorage = new LocalStorage("./scratch");
  }
}
TokenStorage.prototype.store = function (userID, token) {
  // we use specific key for storing access token
  this.localStorage.setItem("privs-" + userID, token);
};
TokenStorage.prototype.get = function (userID) {
  // we get access token back by using specific key
  return this.localStorage.getItem("privs-" + userID);
};
TokenStorage.prototype.remove = function (userID) {
  return this.localStorage.removeItem("privs-" + userID);
};
module.exports = TokenStorage;

