var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server,
    cons = require('consolidate');
var mongoDatabase;
var Hittup = require('../models/hittup');
var User = require('../models/user');

// Body Parser
// var bodyParser = require('body-parser');
// var multer = require('multer'); // v1.0.5
// var upload = multer(); // for parsing multipart/form-data

// router.use(bodyParser.json()); // for parsing application/json
// router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


mongoClient.connect("mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup", function(err, db) {
      if (err) {
        console.log(err);
        return(err);
      }
      else{
      	// console.log("success");
      	mongoDatabase = db;
      	console.log("connected to db: " + db);

      }
    });

/* GET home page. */ 
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Hittup Rest API' });
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


module.exports = router;
