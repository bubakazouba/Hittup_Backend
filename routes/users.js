var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID
var geolocation = require('../modules/geolocation');

var Hittup = require('../models/hittup');
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Users!!');
});

function getFBFriends(uid, callback){
    collection = mongodb.db().collection("users");
    collection.find({"_id":ObjectID(uid)}).toArray(function(err,docs){
        if (docs.length==0){
            callback("user doesn't exist");
        }
        else {
            callback(null, docs[0].fbFriends);
        }
    });
}

router.post('/GetFriendsList', function(req, res){
    if(mongodb.db()){
        getFBFriends(req.body.uid, function(err, fbFriends){
            if(err){
                res.send({"error": err});
                return;
            }
            res.send(fbFriends);
        });
    } else {
        res.send("DB Not Connected")
    }
});

// router.post('/AddUser', function (req, res, next) {
//     userCollection = mongoDatabase.collection("Users");
//     userCollection.find({"fbid":req.body.fbid}).toArray(function(err,docs){
//         if (docs.length==0){ //if user doesn't exist
//             userCollection.insert({"fbid":req.body.fbid, "fbToken": req.body.fbToken}, function (err,user){
//                 if(err){
//                     res.send({"success":"false","error":err.message})
//                     return;
//                 }
//                 res.send({"success":"true", "uid": user.ops[0]._id.toString()});
//             });
//         }
//     });
// });

router.post('/AddUser', function (req, res, next) {
  User.findOne({ fbid: req.body.fbid }, function (err, user) {
      if(err){
        return res.send({"success":"false", "error": err.message})
      }
      if(user != null){

        user.fbToken = req.body.fbToken;
        user.save(function (err,insertedUser){
            if(err){
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

        user.save(function (err,insertedUser){
            if(err){
                res.send({"success":"false","error":err.message})
                return;
            }
            res.send({"success":"true", "uid": insertedUser.id});
        });
      }
  });
});

router.post('/UpdateUserLocation', function(req, res, next) {
    // var collection = mongodb.db().collection('users');

    var uid = req.body.uid;
    var loc = req.body.coordinates;

    geolocation.geoReverseLocation(loc,function(location){
        mongodb.db().collection('users').update(
            {_id: ObjectID(req.body.uid)},
            { $set: {location: location}}    );
        res.send({"city":location.city,"success":"true"});
    });
})

module.exports = router;
