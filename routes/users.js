var http = require('http');
var express = require('express');
var router = express.Router();
var mongoDatabase = require('../db');

var Hittup = require('../models/hittup');
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Users!!');
});

var geoReverseLocation = function(loc,callback){
    /*
     * args:
     * loc:  [longitude, latitude],
     * callback: function that accepts a location object {city,state,coordinates:[long,lat]}
     */
    var reverseGeoPath = '/geocoding/v1/reverse?key=uZ3qgc5oMFTTLZo6MILAjgRJpKQArDtO&callback=renderReverse&location=';
    options = {
        hostname: 'www.mapquestapi.com',
        path: reverseGeoPath+loc[1]+","+loc[0],
        method: 'GET'
    }

    var request = http.request(options,function(reverseGeoResponse){
        var data='';
        reverseGeoResponse.on('data',function(chunk){
            data+=chunk
        });//end .on(data)
        reverseGeoResponse.on('end',function(){
            data=data.substr(data.indexOf('(')+1,data.length-data.indexOf('(')-2); //removing the "renderReverse(...)" around JSON string
            data=JSON.parse(data);
            var responseLocation=data.results[0].locations[0];
            var location={"City":-1,"State":-1}
            //parsing JSON returned, example: http://tinyurl.com/q2mmnsa
            for(var prop in responseLocation){
                if(Object.keys(location).indexOf(responseLocation[prop])!=-1){
                    location[responseLocation[prop]]=responseLocation[prop.substr(0,prop.length-4)]
                }
            }
            //confirming with DB scheme
            location.city=location.City;
            location.state=location.State;
            delete location.City;
            delete location.State;
            location.coordinates=[loc[0],loc[1]]
            callback(location);
        })
    }); //end http.request
    request.end();
}

function getFBFriends(uid, callback){
    collection = mongoDatabase.collection("Users");
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
    if(mongoDatabase){
        getFBFriends(req.body.uid, function(err, fbFriends){
            if(err){
                res.send({"error": err});
                return;
            }
            res.send(fbFriends);
        });
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
        res.send({
            "uid": user.id,
            "userStatus": "returning",
            "fbFriends": user.fbFriends,
            "success": "true"
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
    var collection = mongoDatabase.collection('Users');

    var uid = req.body.uid;
    var loc = req.body.coordinates;

    geoReverseLocation(loc,function(location){
        mongoDatabase.collection('Users').update(
            {_id: ObjectID(req.body.uid)},
            { $set: {location: location}}    );
        res.send({"city":location.city,"success":"true"});
    });
})

module.exports = router;
