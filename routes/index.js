var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server,
    cons = require('consolidate');

var mongoDatabase;

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

module.exports = router;
