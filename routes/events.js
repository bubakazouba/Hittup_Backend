var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');

var User = require('../models/user');
var Event = require('../models/event');
var HittupHelper = require('../modules/HittupHelper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Hittup Events!');
});

function getAvailableOccasions(uid, events){
    var availableEvents = [];
    for (var i = events.length - 1; i >= 0; i--) {//TODO: include that in the query
        if(events[i].isPrivate=="true"){
            for (var j = events[i].usersInvited.length - 1; j >= 0; j--) {
                if(uid == events[i].usersInvited[j].uid){
                    availableEvents.push(events[i]);
                }
            }
        }
        else {
            availableEvents.push(events[i]);
        }
    }
    return availableEvents;
}

router.post('/GetEvents', function(req, res){
    HittupHelper.get(Event,req,res);
});

router.post('/GetInvitations', function(req, res){
    var body = req.body;
    var timeInterval = 24*60*60; //TODO: better name for this variable
    if(body.hasOwnProperty("timeInterval")){
        timeInterval = body.timeInterval;
    }
    var uid = req.body.uid;
    console.log(req.body.uid);
    if(mongodb.db){
        mongodb.db().collection('Events').find({
          usersInvited: {
            $elemMatch: {
              uid: req.body.uid
            }
          }
        }).toArray(function(err, json){
                    console.log(json);
            res.send(json);
            if(err){
                console.log('Error while getting general info: err'+err.message);
                return res.send({"success":"false", "error": err.message});
            }
        });
    }
});
module.exports = router;