'use strict';

var heartbeats = require('heartbeats');
var instances = require('./instances');
var os = require('os');
var filesize = require('filesize');



module.exports.heartRefreshInstances = function (socket) {

    // Caching the instances list to have a reference for comparisons to come.
    var cacheInstances = {};

    // THE HEARTBEATS HEART : This one refreshes the instances list on table.js component.
    // Repeat every 5000 milliseconds = every 5 seconds.
    var heart1 = heartbeats.createHeart(5000);

    // For infinite repeat we use {repeat : 0}.
    heart1.createEvent(1, {repeat : 0}, function(heartbeat, last) {

    // Instructions done on each heart beat.
    // Debug
    //console.log("########## BEAT HEART 1 ! ##########");

        instances.getInstances(function(err, beatInstances) {

            if (err) { return next(err); }

            // If there are some differences between cacheInstances (reference)
            //and beatInstances (just get) :
            // Update cacheInstances with beatInstances.
            // Broadcast to all users this new version to update
            //the 'containers' variable in template.html and refresh the table.js component.
            if (!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances))) {

                cacheInstances = beatInstances;
                socket.broadcast.emit('refreshInstances', beatInstances);

            }

        });
    });
};


module.exports.heartRefreshInfosMachine = function (socket) {

    // THE HEARTBEATS HEART : This one refreshes machine information
    //on infosMachine.js component.

    // Repeat every 1000 milliseconds = every 1 seconds.
    var heart2 = heartbeats.createHeart(1000);

    // For infinite repeat we use {repeat : 0}.
    heart2.createEvent(1, {repeat : 0}, function(heartbeat, last) {

        // Instructions done on each heart beat.

        // Debug
        //console.log("########## BEAT HEART 2 ! ##########");

        // Getting machine information we want to display.
            var infosMachine = {};

            // Returns an array containing the 1, 5, and 15 minute load averages.
            infosMachine.loadAverage = os.loadavg();
            // Trunc loadAverage values.
            var numberOfDecimalNumbers = 2;
            infosMachine.loadAverage[0] = infosMachine.loadAverage[0].toFixed(numberOfDecimalNumbers);
            infosMachine.loadAverage[1] = infosMachine.loadAverage[1].toFixed(numberOfDecimalNumbers);
            infosMachine.loadAverage[2] = infosMachine.loadAverage[2].toFixed(numberOfDecimalNumbers);

            infosMachine.totalMemory = filesize(os.totalmem()); // os.totalmem() returns the total amount of system memory in bytes.
            infosMachine.freeMemory = filesize(os.freemem()); // os.freemem() returns the amount of free system memory in bytes.

        // Broadcast to all users the machine information. They are caught and displayed on template.html inside infosMachineTable.js component.
        socket.broadcast.emit('refreshInfosMachine', infosMachine);

        // When we come on the page, while testing in local, machine info are not displayed, we have to refresh for that.
        // To solve this problem we do a simple emit because in local,
        //our pc is the server so the emit.broadcast send to OTHER users.
        // On the vilodex, obviously no issue because the server broadcast to all users.
        // As a consequence, this line can be commented when the code is deployed on the vilodex.
        socket.emit('refreshInfosMachine', infosMachine);

    });
};




