var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');


var User = require('../models/Users');
var FriendHittups = require('../models/FriendHittups');
var HittupHelper = require('../modules/HittupHelper');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Hello /Hittups!');
});

router.post('/GetHittups', function (req, res){
    HittupHelper.get(FriendHittups,req,res);
});

// Post
router.post('/PostHittup', function (req, res, next) {
    var body = req.body;
    var hittup = new FriendHittups({
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
    geolocation.geoReverseLocation(hittup.loc.coordinates, function (location){
        hittup.loc.city = location.city;
        hittup.loc.state = location.state;
        hittup.save(function (err) {
            if (err) {
                console.log("Save Error: " + err.message);
                return res.send({"success":"false", "error": err.message});
            } 
            res.send({"success":"true"});
        });
    });
}); 

router.post('/GetInvitations', function (req, res){
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
    // // var query = FriendHittups.find({"usersInvited._id": req.body.uid});
    // var query = FriendHittups.find({
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
});


module.exports = router;
