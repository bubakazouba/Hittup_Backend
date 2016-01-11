var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');

var User = require('../models/Users');
var EventHittups = require('../models/EventHittups');
var HittupHelper = require('../modules/HittupHelper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Hittup Events!');
});

router.post('/GetEvents', function(req, res){
    HittupHelper.get(EventHittups,req,res);
});

router.post('/GetInvitations', function(req, res){
    var body = req.body;
    var timeInterval = 24*60*60; //TODO: better name for this variable
    if(body.hasOwnProperty("timeInterval")){
        timeInterval = body.timeInterval;
    }
    var uid = req.body.uid;
    if(mongodb.db){
        mongodb.db().collection('EventHittups').find({
          usersInvited: {
            $elemMatch: {
              uid: req.body.uid
            }
          }
        }).toArray(function(err, json){
            res.send(json);
            if(err){
                console.log('Error while getting general info: err'+err.message);
                return res.send({"success":"false", "error": err.message});
            }
        });
    }
});
module.exports = router;