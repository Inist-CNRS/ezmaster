// Script used to autonomate latest application creation 
// from the latest dockerhub published tag.
// And to automaticaly create a new instance from this app.
// 
// Example call:
// IMAGE_BASENAME="istex/istex-dl" TECHNICAL_NAME="istex-dl" node auto-create-new-version.js

var helper = require('./helper.js');

const IMAGE_BASENAME       = process.env.IMAGE_BASENAME ? process.env.IMAGE_BASENAME : "istex/istex-dl";
const TECHNICAL_NAME       = process.env.TECHNICAL_NAME ? process.env.TECHNICAL_NAME : "istex-dl";
const CONFIG_FROM_INSTANCE = process.env.CONFIG_FROM_INSTANCE ? process.env.CONFIG_FROM_INSTANCE    : "";

helper.downloadAndCreateLatestApplicationVersion(IMAGE_BASENAME, function (err, IMAGE_NAME) {
  if (!IMAGE_NAME) return;
  helper.getLatestInstanceVersion(TECHNICAL_NAME, function (err, version) {
    helper.getVersionComment(IMAGE_BASENAME, IMAGE_NAME.split(':')[1], function (err, versionComment) {
      const NEW_INSTANCE = TECHNICAL_NAME + '-' + (version+1);
      helper.createNewInstance(
        versionComment ? versionComment : 'Version ' + IMAGE_NAME,
        NEW_INSTANCE,
        IMAGE_NAME, function (err) {
          // initialize config if necessary
          if (CONFIG_FROM_INSTANCE) {
            helper.getInstanceDetailsFromTechnicalName(CONFIG_FROM_INSTANCE, function (err, instanceDetails) {
              helper.updateInstanceConfig(NEW_INSTANCE, instanceDetails.config, function (err) {
                console.log('Finished');
              });
            });
          } else {
            console.log('Finished');
          }
        }
      );
    });
  });
});

//helper.updateInstanceConfig("istex-dl-2", { lol: "stuff" });
//helper.getInstanceDetailsFromTechnicalName("istex-dl-2", console.log);