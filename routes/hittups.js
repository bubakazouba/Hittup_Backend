var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');
var Hittup = require('../models/hittup');
var User = require('../models/user');
var HittupHelper = require('../modules/HittupHelper');
var Logger = require('../modules/Logger');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Hittups!');
});

router.post('/GetHittups', function(req, res){
    HittupHelper.get(Hittup,req,res);
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
                Logger.log(err.message,req.connection.remoteAddress, null, "/PostHittup");
                return res.send("Save Error: " + err.message);
            } 
            res.send("Successful save!")
        });
    });
}); 

router.post('/GetInvitations', function(req, res){
    var body = req.body;
    var timeInterval = 24*60*60; //TODO: better name for this variable
    if(body.hasOwnProperty("timeInterval")){
        timeInterval = body.timeInterval
    }

    var uid = req.body.uid;
    console.log(req.body.uid);
    if(mongodb.db){
        mongodb.db().collection('Hittups').find({
          usersInvited: {
            $elemMatch: {
              uid: req.body.uid
            }
          }
        }).toArray(function(err, json){
                    console.log(json);

          
            res.send(json);
            if(err){
                Logger.log(err.message,req.connection.remoteAddress, null, "/GetInvitations");
                console.log('Error while getting general info: err');
                return res.send(err);
            }
        });
    }
});


module.exports = router;
