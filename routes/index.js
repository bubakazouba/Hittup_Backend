var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server,
    cons = require('consolidate');
var mongoDatabase;
var Hittup = require('../models/hittup');

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
      	console.log("success");
      	mongoDatabase = db;
      	console.log("connected to db: " + db);

      }
    });

/* GET home page. */ 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hittup Rest API' });
});

router.get('/hittup', function(req, res){

	if(mongoDatabase){
		mongoDatabase.collection('Hittups').insert({
	    	item: "ABC1",
	    	details: {
	      		model: "14Q3",
	        	manufacturer: "XYZ Company"
	     	},
	     	stock: [ { size: "S", qty: 25 }, { size: "M", qty: 50 } ],
	     	category: "clothing"
		});
		return res.send("Lol yayt");
	} else {
		res.send("Lol wut");
	}
});


// Post
router.post('/posthittup', function (req, res, next) {
	if(mongoDatabase){
		var hittup = Hittup();
		var body = req.body;

		hittup.title = body.title;
		hittup.isPrivate = (body.isPrivate === "true");
		hittup.save();
		// mongoDatabase.collection('Hittups').insert(hittup);
		return res.send("Lol yayt");
	} else {
		res.send("Lol wut");
	}

	res.send("Lol wut");
});


module.exports = router;
