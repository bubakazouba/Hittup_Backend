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


router.post('/JoinHittup', function (req, res){
    var body = req.body;
    var owneruid = body.owneruid;
    var hittupuid = body.hittupuid;
    FriendHittups.findByIdAndUpdate(
        ObjectID(hittupuid),
        {
            $push: { //try without quotes
                "usersJoined": {
                    "_id": ObjectID(owneruid)
                }
            }
        },
        function (err, model) {
            if(err){
                res.send({"success": "false", "error": err.message});
                return Logger.log(err.message,req.connection.remoteAddress, null, "function: PostHittup");
            }
            res.send({"success":"true"});
        }
    );//end .update
});

// Post
router.post('/PostHittup', function (req, res, next) {
    HittupHelper.post(FriendHittups,req,res);
}); 

router.post('/GetInvitations', function (req, res){
    HittupHelper.GetInvitations(FriendHittups,req,res);
});


module.exports = router;
