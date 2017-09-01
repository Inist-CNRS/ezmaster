// Script used to autonomate latest application creation 
// from the latest dockerhub published tag.
// And to automaticaly create a new instance from this app.
// 
// Example call:
// IMAGE_BASENAME="istex/istex-dl" TECHNICAL_NAME="istex-dl" node auto-create-new-version.js

var helper = require('./helper.js');

const IMAGE_BASENAME = process.env.IMAGE_BASENAME ? process.env.IMAGE_BASENAME : "istex/istex-dl";
const TECHNICAL_NAME = process.env.TECHNICAL_NAME ? process.env.TECHNICAL_NAME : "istex-dl";

helper.downloadAndCreateLatestApplicationVersion(IMAGE_BASENAME, function (err, IMAGE_NAME) {
  if (!IMAGE_NAME) return;
  helper.getLatestInstanceVersion(TECHNICAL_NAME, function (err, version) {
    helper.createNewInstance(
      'Version ' + IMAGE_NAME,
      TECHNICAL_NAME + '-' + (version+1),
      IMAGE_NAME, function (err) {
        console.log('Finished');
      }
    );
  });
});