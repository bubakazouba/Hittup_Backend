var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');

var Hittup = require('../models/hittup');
var User = require('../models/user');
var Event = require('../models/event');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Hittup Events!');
});

function getAvailableEvents(uid, events){
    var availableEvent = []
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
    }
    return availableEvents;
}



module.exports = router;
