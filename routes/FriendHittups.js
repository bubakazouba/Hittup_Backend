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
    HittupHelper.get(FriendHittups,req, function(result){
        res.send(result);
    });
});

router.post('/JoinHittup', function (req, res){
    HittupHelper.JoinHittup(FriendHittups, req, function (result){
        res.send(result);
    });
});


router.post('/GetInvitations', function (req, res){
    HittupHelper.getInvitations(FriendHittups, req, function (result){
        res.send(result);
    });
});

router.post('/PostHittup', function (req, res, next) {
    HittupHelper.post(FriendHittups, req, function (result){
        res.send(result);
    });
}); 



module.exports = router;