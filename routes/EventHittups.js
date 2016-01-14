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

router.post('/GetHittups', function(req, res){
    HittupHelper.get(EventHittups,req,res);
});

router.post('/InviteFriends', function (req, res){
    HittupHelper.invite(EventHittups, req, res);
});

router.post('/GetInvitations', function(req, res){
    HittupHelper.getInvitations(EventHittups,req,res);
});

router.post('/PostHittup', function (req, res, next) {
    HittupHelper.post(EventHittups,req,res);
}); 

module.exports = router;