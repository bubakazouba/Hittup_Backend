var http = require('http');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server,
    cons = require('consolidate');

var mongoDatabase;
var reverseGeoPath = '/geocoding/v1/reverse?key=uZ3qgc5oMFTTLZo6MILAjgRJpKQArDtO&callback=renderReverse&location=';


mongoClient.connect("mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup", function(err, db) {
    if (err) {
        console.log(err);
        return(err);
  }
  else {
  	console.log("success");
  	mongoDatabase = db;
  	console.log("connected to db: " + db)
  }
});

/* GET home page. */ 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hittup Rest API' });
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

    var user = User();
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
            console.log(location);
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