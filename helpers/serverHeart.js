
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

	                infosMachine["loadAverage"] = os.loadavg(); // Returns an array containing the 1, 5, and 15 minute load averages.
	                // Trunc loadAverage values.
	                var lengthDesired = 5;
					infosMachine["loadAverage"][0] = (infosMachine["loadAverage"][0]+"").substring(0,lengthDesired);
					infosMachine["loadAverage"][1] = (infosMachine["loadAverage"][1]+"").substring(0,lengthDesired);
					infosMachine["loadAverage"][2] = (infosMachine["loadAverage"][2]+"").substring(0,lengthDesired);


	        		infosMachine["totalMemory"] = convertBytesToOctets(os.totalmem()); // os.totalmem() returns the total amount of system memory in bytes.
	        		infosMachine["freeMemory"] = convertBytesToOctets(os.freemem()); // os.freemem() returns the amount of free system memory in bytes.
	        		function convertBytesToOctets(number) {

	        			if ((number+"").length < 3)
	        				return (number+"").substring(0,lengthDesired) + " o";
	        			else if ((number+"").length >= 3 && (number+"").length < 6)
	        				return ((number/1000)+"").substring(0,lengthDesired) + " ko";
	        			else if ((number+"").length >= 6 && (number+"").length < 9)
	        				return ((number/1000000)+"").substring(0,lengthDesired) + " Mo";
	        			else if ((number+"").length >= 9 && (number+"").length < 12)
	        				return ((number/1000000000)+"").substring(0,lengthDesired) + " Go";
	        			else if ((number+"").length >= 12 && (number+"").length < 15)
	        				return ((number/1000000000000)+"").substring(0,lengthDesired) + " To";
	        			else if ((number+"").length >= 15 && (number+"").length < 18)
	        				return ((number/1000000000000000)+"").substring(0,lengthDesired) + " Po";
	        			else if ((number+"").length >= 18 && (number+"").length < 21)
	        				return ((number/1000000000000000000)+"").substring(0,lengthDesired) + " Eo";
	        			else if ((number+"").length >= 21 && (number+"").length < 24)
	        				return ((number/1000000000000000000000)+"").substring(0,lengthDesired) + " Zo";
	        			else if ((number+"").length >= 24 && (number+"").length < 27)
	        				return ((number/1000000000000000000000000)+"").substring(0,lengthDesired) + " Yo";

	        		}

              	// Broadcast to all users the machine information. They are caught and displayed on template.html inside infosMachineTable.js component.
              		socket.broadcast.emit('refreshInfosMachine', infosMachine);

          });
	};











