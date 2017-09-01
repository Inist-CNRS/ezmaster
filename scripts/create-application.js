// IMAGE_BASENAME="library/nginx" node scripts/create-application.js
var helper = require('./helper.js');


const IMAGE_BASENAME = process.env.IMAGE_BASENAME ? process.env.IMAGE_BASENAME : "istex/istex-dl";

helper.downloadAndCreateLatestApplicationVersion(IMAGE_BASENAME);