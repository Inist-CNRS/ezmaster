
	var heartbeats = require('heartbeats');
	var instances = require('./instances');
	var os = require('os');


	module.exports.heartRefreshInstances = function (socket) {

	    // Caching the instances list to have a reference for comparisons to come.
	    var cacheInstances = {};

        // THE HEARTBEATS HEART : This one refreshes the instances list on table.js component.

          // Repeat every 5000 milliseconds = every 5 seconds.
          var heart1 = heartbeats.createHeart(5000);

          // For infinite repeat we use {repeat : 0}.
          heart1.createEvent(1, {repeat : 0}, function(heartbeat, last){

            // Instructions done on each heart beat.

              // Debug
              //console.log("########## BEAT HEART 1 ! ##########");

              instances.getInstances(function(err,beatInstances){

                // If there are some differences between cacheInstances (reference) and beatInstances (just get) :
                  // Update cacheInstances with beatInstances.
                  // Broadcast to all users this new version to update the 'containers' variable in template.html and refresh the table.js component.
                if(!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances) )) {

                  cacheInstances = beatInstances;
                  socket.broadcast.emit('refreshInstances', beatInstances);

                }

              });
          });
	};


	module.exports.heartRefreshInfosMachine = function (socket) {

        // THE HEARTBEATS HEART : This one refreshes machine information on infosMachine.js component.

          // Repeat every 1000 milliseconds = every 1 seconds.
          var heart2 = heartbeats.createHeart(1000);

          // For infinite repeat we use {repeat : 0}.
          heart2.createEvent(1, {repeat : 0}, function(heartbeat, last){

            // Instructions done on each heart beat.

              	// Debug
              	//console.log("########## BEAT HEART 2 ! ##########");

              	// Getting machine information we want to display.
              	var infosMachine = {};
                infosMachine["loadAverage"] = os.loadavg();
        		infosMachine["totalMemory"] = os.totalmem()
        		infosMachine["freeMemory"] = os.freemem()

              	// Broadcast to all users the machine information. They are caught and displayed on template.html inside infosMachineTable.js component.
              	socket.broadcast.emit('refreshInfosMachine', infosMachine);

          });
	};











