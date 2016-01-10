var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');
var Hittup = require('../models/hittup');
var Event = require('../models/event');


function getAvailableOccasions(uid,occasions){
    var availableOccasions = []
    for (var i = occasions.length - 1; i >= 0; i--) {//TODO: include that in the query
        if(occasions[i].isPrivate=="true"){
            for (var j = occasions[i].usersInvited.length - 1; j >= 0; j--) {
                if(uid == occasions[i].usersInvited[j].uid){
                    availableOccasions.push(occasions[i]);
                }
            }
        }
        else {
            availableOccasions.push(occasions[i]);
        }
    }
    return availableOccasions;
}


function get(Schema, req, res){
	if(mongodb.db()){
        var body = req.body;
        var uid = body.uid;
        var coordinates = body.coordinates;
        var longitude = parseFloat(coordinates[0]);
        var latitude = parseFloat(coordinates[1]);
        console.log(coordinates);
        var timeInterval = 24*60*60; //TODO: better name for this variable
        if(body.hasOwnProperty("timeInterval")){
            timeInterval = body.timeInterval;
        }
        if(body.hasOwnProperty("maxDistance")){
            var maxDistance = parseFloat(body.maxDistance);
            var query = Schema.find({
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
                console.log("going thru in get")
                res.send(getAvailableOccasions(uid, results));
            });
        }
        else {
        	console.log("61");
            //TODO use promises, async callback here has no use
            geolocation.geoReverseLocation(coordinates, function(location){
                var query = Schema.find({"loc.city": location.city, "loc.state": location.state});
                console.log( location);
                console.log("bruh");
                query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
                query.exec(function (err,results) {
                    if(err){
                        return res.send({"success":"false", "error": err.message});
                    }
                    console.log("Success");
                   	console.log(results);
                    res.send(getAvailableOccasions(uid, results));
                });
            });
        }//end else if user didn't specify maxDistance
    } else {
        res.send("MongoDB not Connected");
    }
}

module.exports = {get:get};