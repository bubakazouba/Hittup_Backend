var http = require('http');
var express = require('express');
var router = express.Router();
var mongoDatabase = require('../db');

var Hittup = require('../models/hittup');
var User = require('../models/user');

/* GET home page. */ 
router.get('/', function(req, res, next) {
	res.send("Hello Hittup!");
});


module.exports = router;