// Script used to autonomate latest application creation 
// from the latest dockerhub published tag.
// And to automaticaly create a new instance from this app.
// 
// Example call:
// APPLICATION_BASENAME="istex/istex-dl" INSTANCE_BASENAME="istex-dl" CONFIG_FROM_INSTANCE="istex-dl-2" node auto-create-new-version.js

var helper = require('./helper.js');

const APPLICATION_BASENAME = process.env.APPLICATION_BASENAME ? process.env.APPLICATION_BASENAME : "istex/istex-dl";
const INSTANCE_BASENAME    = process.env.INSTANCE_BASENAME ? process.env.INSTANCE_BASENAME : "istex-dl";
const CONFIG_FROM_INSTANCE = process.env.CONFIG_FROM_INSTANCE ? process.env.CONFIG_FROM_INSTANCE    : "";

helper.downloadAndCreateLatestApplication(APPLICATION_BASENAME, function (err, APPLICATION_NAME) {
  if (!APPLICATION_NAME) return;
  helper.getLatestInstanceVersion(INSTANCE_BASENAME, function (err, version) {
    helper.getGithubTagComment(APPLICATION_BASENAME, APPLICATION_NAME.split(':')[1], function (err, versionComment) {
      const NEW_INSTANCE = INSTANCE_BASENAME + '-' + (version+1);
      helper.createNewInstance(
        versionComment ? versionComment : 'Version ' + APPLICATION_NAME,
        NEW_INSTANCE,
        APPLICATION_NAME, function (err) {
          // initialize config if necessary
          if (CONFIG_FROM_INSTANCE) {
            helper.getInstanceDetailsFromName(CONFIG_FROM_INSTANCE, function (err, instanceDetails) {
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