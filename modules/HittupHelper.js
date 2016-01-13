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
        if(hittups[i].isPrivate==true){
            for (var j = hittups[i].usersInvited.length - 1; j >= 0; j--) {
                if(uid == hittups[i].usersInvited[j]._id.toString()){
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


function get(HittupSchema, req, res){
	if(mongodb.db()){
         var body = req.body;
         var uid = body.uid;
         var coordinates = body.coordinates;
         var longitude = parseFloat(coordinates[0]);
         var latitude = parseFloat(coordinates[1]);
         var timeInterval = 24*60*60; //TODO: better name for this variable
         if(body.hasOwnProperty("timeInterval")){
             timeInterval = body.timeInterval;
         }
         if(body.hasOwnProperty("maxDistance")){
             var maxDistance = parseFloat(body.maxDistance);
             var query = HittupSchema.find({
                 loc: {
                     $nearSphere: [longitude, latitude],
                     $maxDistance: maxDistance //in kilometers
                 }
             });
             query.populate({
                 path: 'owner usersInvited usersJoined',
                 select: 'firstName lastName fbid'
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
             geolocation.geoReverseLocation(coordinates, function(err, location){
				if(err){
                    Logger.log(err.message,req.connection.remoteAddress, null, "function: get");
                }
                 var query = HittupSchema.find({"loc.city": location.city, "loc.state": location.state});
                 query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
                 query.populate({
                     path: 'owner usersInvited usersJoined',
                     select: 'firstName lastName fbid'
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

function post(HittupSchema,req,res){
    var body = req.body;
    var hittup = new HittupSchema({
        owner: ObjectID(body.uid),
        title: body.title,
        isPrivate: ( body.isPrivate.toLowerCase() == "true" ),
        duration: parseInt(body.duration),
        dateCreated: Math.floor(Date.now()/1000),
        loc: {
            type: "Point",
            coordinates: [parseFloat(body.coordinates[0]), parseFloat(body.coordinates[1])]
        }
    });
    if(body.hasOwnProperty("usersInviteduids")){
        usersInvitedReferences = [];
        for (var i = body.usersInviteduids.length - 1; i >= 0; i--) {
            usersInvitedReferences.push(ObjectID(body.usersInviteduids[i]));
        }
        hittup.usersInvited = usersInvitedReferences;
    }
    geolocation.geoReverseLocation(hittup.loc.coordinates, function (err, location){
        hittup.loc.city = location.city;
        hittup.loc.state = location.state;
        hittup.save(function (err) {
            if (err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "function: post");
                console.log("Save Error: " + err.message);
                return res.send({"success":"false", "error": err.message});
            } 
            res.send({"success":"true"});
        });
    });
}

function getInvitations(HittupSchema,req,res){
    if(!mongodb.db){return res.send({"success": "false", "error": "DB not connected"});}
    res.end({"success":"false","error":"im not implemented yet"});
    // var body = req.body;
    // var timeInterval = 24*60*60; //TODO: better name for this variable
    // var uid = req.body.uid;
    // if(body.hasOwnProperty("timeInterval")) {
    //     timeInterval = body.timeInterval;
    // }
    // console.log(req.body.uid);
    // console.log(ObjectID(req.body.uid));
    // // var query = HittupSchema.find({"usersInvited._id": req.body.uid});
    // var query = HittupSchema.find({
    //   usersInvited: {
    //     $elemMatch: {
    //       _id: ObjectID(req.body.uid)
    //     }
    //   }
    // });
    // query.populate({
    //     path: 'usersInvited',
    //     select: 'firstName lastName'
    // });
    // query.exec(function (err, results){
    //     if (err) {
    //         return res.send({"success": "false", "error": err.message});
    //     }
    //     console.log(results);
    //     res.send(results);
    // });
}

module.exports = {get:get, post:post, getInvitations:getInvitations};