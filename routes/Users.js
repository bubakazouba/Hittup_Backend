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
    collection = mongodb.db().collection("Users");
    collection.find({"_id":ObjectID(uid)}).toArray(function (err,docs) {
        if (docs.length==0) {
            callback("user doesn't exist");
        }
        else {
            callback(null, docs[0].fbFriends);
        }
    });
}

router.post('/GetFriendsList', function (req, res) {
    if(mongodb.db()) {
        getFBFriends(req.body.uid, function (err, fbFriends) {
            if(err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "/GetFriendsList");
                res.send({"success": "false", "error": err.message});
                return;
            }
            res.send(fbFriends);
        });
    } else {
        res.send("DB Not Connected")
    }
});

router.post('/AddUser', function (req, res, next) {
  User.findOne({ fbid: req.body.fbid }, function (err, user) {
      if(err) {
        Logger.log(err.message,req.connection.remoteAddress, null, "/GetFriendsList");
        return res.send({"success":"false", "error": err.message})
      }
      if(user != null) {

        user.fbToken = req.body.fbToken;
        user.save(function (err,insertedUser) {
            if(err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "/AddUser");
                res.send({
                    "uid": user.id,
                    "userStatus": "returning",
                    "success": "false",
                    "error": err.message
                });
                return;
            } 
            res.send({
                "uid": user.id,
                "userStatus": "returning: Updated fbToken",
                "fbFriends": user.fbFriends,
                "success": "true"
            });
        });
      }
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
                res.send({"success":"false","error":err.message})
                return;
            }
            res.send({"success":"true", "uid": insertedUser.id});
        });
      }
  });
});

router.post('/UpdateUserLocation', function (req, res, next) {
    var uid = req.body.uid;
    var loc = req.body.coordinates;

    geolocation.geoReverseLocation(loc,function (err, location) {
        mongodb.db().collection('Users').update(
            {_id: ObjectID(req.body.uid)},
            { $set: {location: location}}    );
        if(err) {
            Logger.log(err.message,req.connection.remoteAddress, null, "/GetFriendsList");
            return res.send({"success":"false", "error": err.message})
            return 
        }
        res.send({"city":location.city,"success":"true"});
    });
})

module.exports = router;
