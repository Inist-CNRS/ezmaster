/* global io */
module.exports = {
  ezMasterAPI: '',
  socket: io(document.location.protocol + '//' + document.location.hostname + ':' + 35269),
  applications: []
};
