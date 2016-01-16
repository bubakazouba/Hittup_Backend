var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID
var geolocation = require('../modules/geolocation');
var User = require('../models/Users');
var Logger = require('../modules/Logger');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Hello /Users!!');
});

function getFBFriends(uid, callback) {
    //returns [] if user not found

    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}

    var query = User.findOne({_id: ObjectID(uid)});
    query.populate({
        path: 'fbFriends',
        select: 'firstName lastName fbid loc'
    });

    query.exec(function (err, userFound){
        console.log(userFound);
        if(err){
            return callback(err);
        }
        if(userFound){
            callback(null, userFound.fbFriends);
        }
        else {
            callback(null, []);
        }
    });
}

router.post('/GetFriendsList', function (req, res) {
    getFBFriends(req.body.uid, function (err, fbFriends) {
        if(err) {
            Logger.log(err.message,req.connection.remoteAddress, null, "/GetFriendsList");
            res.send({"success": false, "error": err.message});
            return;
        }
        res.send(fbFriends);
    });
});

router.post('/AddUser', function (req, res, next) {
    var query = User.findOne({ fbid: req.body.fbid });
    query.populate({
        path: 'fbFriends',
        select: 'firstName lastName fbid loc'
    });
    query.exec(function (err, user) {
      if(err) {
        Logger.log(err.message,req.connection.remoteAddress, null, "/GetFriendsList");
        return res.send({"success": false, "error": err.message})
      }
      if(user != null) { //if he was a returning user
        user.fbToken = req.body.fbToken;
        user.save(function (err,user) {
            if(err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "/AddUser");
                res.send({
                    "uid": user.id,
                    "userStatus": "returning",
                    "success": false,
                    "error": err.message
                });
                return;
            } 
            res.send({
                "uid": user.id,
                "userStatus": "returning: Updated fbToken",
                "fbFriends": user.fbFriends,
                "success": true
            });
        });
      } //end if user != null
      else {
        user = new User();
        user.fbid = req.body.fbid;
        user.fbToken = req.body.fbToken;
        user.loc= {
            type: "Point",
            coordinates: [-10, -10] //mongoose doesnt like empty coordinates cuz it's being indexed
                                    //so i just added a point in the middle of the sea
                                    //TODO: fix that
        }

        user.save(function (err,insertedUser) {
            if(err) {
                res.send({"success": false,"error":err.message})
                return;
            }
            res.send({"success": true, "uid": insertedUser.id});
        });
      }//end if user == null
  });
});

router.post('/UpdateUserLocation', function (req, res, next) {
    var body = req.body;
    var uid = body.uid;
    var loc = {
        type: "Point",
        coordinates: body.coordinates        
    }

    geolocation.geoReverseLocation(loc.coordinates, function (err, location) {
        loc.city = location.city;
        loc.state = location.state;
        User.findByIdAndUpdate(ObjectID(uid), {loc: loc}, function (err, updatedUser){
            if(err) {
                res.send({"success": false, "error": err.message})
                return Logger.log(err.message,req.connection.remoteAddress, null, "/UpdateUserLocation");
            }
            res.send({"city":location.city,"success": true});
        });
    });
});

module.exports = router;
