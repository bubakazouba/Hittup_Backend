var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;

var Hittup = require('../models/hittup');
var User = require('../models/user');

/* GET home page. */ 
router.get('/', function(req, res, next) {
	res.send("Hello Hittup! (On Aashir Server)");
});

module.exports = router;
