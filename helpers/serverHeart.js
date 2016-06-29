


	var heartbeats = require('heartbeats');
	var instances = require('./instances');



	module.exports.serverHeart = function (cacheInstances, socket) {


	        // THE HEARTBEATS HEART

	          // Repeat every 5000 milliseconds = every 5 seconds.
	          var heart1 = heartbeats.createHeart(5000);

	          // For infinite repeat we use {repeat : 0}.
	          heart1.createEvent(1, {repeat : 0}, function(heartbeat, last){

	            // Instructions done on each heart beat.

	              // Debug
	              //console.log("########## BEAT ! ##########");



	              instances.getInstances(function(err,beatInstances){

	                // If there are some differences between cacheInstances (reference) and beatInstances (just get) :
	                  // Update cacheInstances with beatInstances.
	                  // Broadcast to all users this new version to update the 'containers' variable in template.html.
	                if(!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances) )) {

	                  cacheInstances = beatInstances;
	                  socket.broadcast.emit('refreshInstances', beatInstances);

	                }

	              });
	          });



	};