var http = require('http');
var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server;
var mongoDatabase;
var reverseGeoPath = '/geocoding/v1/reverse?key=uZ3qgc5oMFTTLZo6MILAjgRJpKQArDtO&callback=renderReverse&location=';
var Hittup = require('../models/hittup');
var User = require('../models/user');

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

/* GET home page. */ 
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Hittup Rest API' });
});

router.get('/GetFriendsList', function(req, res){
    if(mongoDatabase){
        mongoDatabase.collection('Users').find().toArray(function(err, json){
            console.log(json);
            res.send(json);
            if(err){
                console.log('Error while getting general info: err');
                return res.send(err);
            }
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
router.post('/posthittup', function (req, res, next) {
	if(mongoDatabase){
		var hittup = Hittup();
		var body = req.body;

		hittup.title = body.title;
		hittup.isPrivate = (body.isPrivate === "true");
		hittup.owner = body.uid;
		hittup.usersInvited = body.usersInvited;
		console.log( [parseFloat(body.location[0]), parseFloat(body.location[1])] );
		hittup.loc.coordinates = [parseFloat(body.location[0]), parseFloat(body.location[1])];
		hittup.duration = body.duration;
		hittup.save(function (err) {
			if (err) {
				console.log(err);
				res.send("Save Error: " + err);
			} else {
				res.send("Successful save!")
			}
		});

	} else {
		res.send("MongoDB not Connected");
	}
});

// router.post('/AddUser', function (req, res, next) {
// 	// console.log(req);

//     collection = mongoDatabase.collection("Hittups");

//     collection.find({"fbid":req.body.fbid}).toArray(function(err,docs){
//         if (docs.length==0){ //if user doesn't exist
//             mongoDatabase.collection('Hittups').insert(req.body);
//         }
//         else { //user already exists
//             var user=docs[0]
//             res.send({
//                         "userStatus":"returning",
//                         "uid": ,

//                     })
//         }
//     })
// 	res.send("Lol yayt");
// });

router.post('/UpdateUserLocation', function(req, res, next) {
    var collection = mongoDatabase.collection('Users');
    console.log('im here')

    var uid = req.body.uid;
    var loc = req.body.location;
    options = {
        hostname: 'www.mapquestapi.com',
        path: reverseGeoPath+loc.lat+","+loc.lon,
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
            console.log(data);
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
            location.coordinates=[loc.lon,loc.lat]
            mongoDatabase.collection('Users').update(
                {_id: ObjectID(req.body.uid)},
                { $set: {location: location}}    );
            res.send({"city":location.city,"success":"true"});
        })
    }); //end http.request
    var buffer=String();
    request.end();
})

module.exports = router;