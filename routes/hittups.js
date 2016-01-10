var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');

var Hittup = require('../models/hittup');
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Hittups!');
});

function getAvailableHittups(uid, hittups){
    var availableHittups = []
    for (var i = hittups.length - 1; i >= 0; i--) {//TODO: include that in the query
        if(hittups[i].isPrivate=="true"){
            for (var j = hittups[i].usersInvited.length - 1; j >= 0; j--) {
                if(uid == hittups[i].usersInvited[j].uid){
                    availableHittups.push(hittups[i]);
                }
            }
        }
        else {
            availableHittups.push(hittups[i]);
        }
    }
    return availableHittups;
}

router.post('/GetHittups', function(req, res){
    if(mongodb.db()){
        var body = req.body;
        var uid = body.uid;
        var coordinates = body.coordinates;
        var longitude = parseFloat(coordinates[0]);
        var latitude = parseFloat(coordinates[1]);
        var timeInterval = 24*60*60; //TODO: better name for this variable
        if(body.hasOwnProperty("timeInterval")){
            timeInterval = body.timeInterval
        }

        if(body.hasOwnProperty("maxDistance")){
            var maxDistance = parseFloat(body.maxDistance);
            var query = Hittup.find({
                loc: {
                    $nearSphere: [longitude, latitude],
                    $maxDistance: maxDistance //in kilometers
                }
            });

            query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
            query.exec(function (err, results) {
                if (err) {
                    return res.send("Error Find: " + err.message);
                }
                res.send(getAvailableHittups(uid, results));
            });
        }
        else {
            //TODO use promises, async callback here has no use
            geolocation.geoReverseLocation(coordinates, function(location){
                var query = Hittup.find({"loc.city": location.city, "loc.state": location.state});
                query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
                query.exec(function (err,results) {
                    if(err){
                        return res.send(err);
                    }
                    res.send(getAvailableHittups(uid, results));
                });
            });
        }//end else if user didn't specify maxDistance
    } else {
        res.send("MongoDB not Connected");
    }
});

// Post
router.post('/PostHittup', function (req, res, next) {
    var body = req.body;
    var hittup = new Hittup({
        title: body.title,
        isPrivate: (body.isPrivate.toLowerCase() == "true"),
        owner: body.owner,
        duration: parseInt(body.duration),
        dateCreated: Math.floor(Date.now()/1000),
        loc: {
            type: "Point",
            coordinates: [parseFloat(body.coordinates[0]), parseFloat(body.coordinates[1])]
        }
    });
    
    if(body.hasOwnProperty("usersInvited")){
        hittup.usersInvited = body.usersInvited;
    }
    geolocation.geoReverseLocation(hittup.loc.coordinates, function(location){
        hittup.loc.city = location.city;
        hittup.loc.state = location.state;
        hittup.save(function (err) {
            if (err) {
                return res.send({"success":"false","error":err.message});
            } 
            res.send({"success":"true"})
        });
    });
}); 


module.exports = router;
