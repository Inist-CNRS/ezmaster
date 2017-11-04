/* global io */
var ezMasterAPI = document.location.protocol + '//' + document.location.hostname + ':' + 35269;
module.exports = {
  ezMasterAPI: ezMasterAPI,
  socket: io(ezMasterAPI),
  applications: []
};
