var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');


function getAvailableHittups(uid,hittups){
    var availableHittups = [];
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


function get(Schema, req, res){
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
             query.populate({
                 path: 'owner usersInvited usersJoined',
                 select: 'firstName lastName'
             });
             query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
             query.exec(function (err, results) {
                 if (err) {
                     return res.send({"success": "false", "error":err.message});
                 }
                 res.send(getAvailableHittups(uid, results));
             });
         }
         else {
             //TODO use promises, async callback here has no use
             geolocation.geoReverseLocation(coordinates, function(location){
                 var query = Hittup.find({"loc.city": location.city, "loc.state": location.state});
                 query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
                 query.populate({
                     path: 'owner usersInvited usersJoined',
                     select: 'firstName lastName'
                 });
                 query.exec(function (err,results) {
                     if(err){
                         return res.send({"success": "false", "error": err.message});
                     }
                     res.send(getAvailableHittups(uid, results));
                 });
             });
         }//end else if user didn't specify maxDistance
     } else {
        res.send({"success": "false", "error": "MongoDB not Connected"});
    }
}

module.exports = {get:get};