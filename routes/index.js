var http = require('http');
var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server;
var mongoDatabase;

var mongoose   = require('mongoose');

mongoose.connect('mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup');

mongoClient.connect("mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup", function(err, db) {
    if (err) {
        console.log(err);
        return(err);
      }
      else{
        mongoDatabase = db;
        console.log("connected to db: " + db);
  }
});

var Hittup = require('../models/hittup');
var User = require('../models/user');




/* GET home page. */ 
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Hittup Rest API' });
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
                console.log(err);
                res.send({"error": err});
                return;
            }
            res.send(fbFriends);
        });
    }
});

// /GetHittups (Get) ARTHUR
// request:
// {	“uid”:<uid>,
// ”location”:<location> }
// location is coordinates

router.get('/GetHittups', function(req, res){
	if(mongoDatabase){
		var uid = req.query.uid;
		var latitude = parseFloat(req.query.latitude);
		var longitude = parseFloat(req.query.longitude);
		// Hittup.ensureIndex({ "location": "2d" });

		console.log([latitude, longitude])
		Hittup.find(
			{ loc:
				{ coordinates: {
			        $near: [latitude, longitude],
			        $maxDistance: 5000
			      }
			   	}	
	     	},
		// .toArray(

	     // Hittup.runCommand({geoNear:"coordinates",near:[latitude,longitude], maxDistance:10/69},

	     	function (err, result) {
				if (err) {
					res.send("Error Find: " + err);
				} else {
					res.send(result);
					// res.send("")
				}
			});
		// return res.send("Lol yayt");
	} else {
		res.send("MongoDB not Connected");
	}
});

// Post
router.post('/PostHittup', function (req, res, next) {

    var hittup = new Hittup();
    var body = req.body;

    hittup.title = body.title;
    hittup.isPrivate = (body.isPrivate == "true");
    hittup.owner = body.owner;
    hittup.duration = parseInt(body.duration);
    hittup.dateCreated = Math.floor(Date.now()/1000);
    if(body.hasOwnProperty("usersInvited")){
        hittup.usersJoined = body.usersInvited;
    }

    hittup.loc.coordinates = [parseFloat(body.coordinates[0]), parseFloat(body.coordinates[1])];
    geoReverseLocation(hittup.loc.coordinates, function(location){
        hittup.loc = location;
        hittup.save(function (err) {
            if (err) {
                return res.send("Save Error: " + err.message);
            } 
            res.send("Successful save!")
        });
    });
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