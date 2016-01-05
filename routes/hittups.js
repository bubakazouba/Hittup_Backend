var http = require('http');
var express = require('express');
var router = express.Router();
var mongoDatabase = require('../db');

var Hittup = require('../models/hittup');
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello /Hittups!');
});

router.post('/GetHittups', function(req, res){
    if(mongoDatabase){
        var body = req.body;
        var uid = body.uid;
        var coordinates = body.coordinates;
        var longitude = parseFloat(coordinates[0]);
        var latitude = parseFloat(coordinates[1]);
        var timeInterval = 24*60*60; //TODO: better name for this variable
        if(body.hasOwnProperty("timeInterval")){
            timeInterval = body.timeInterval
        }

        if(body.hasOwnProperty("maxDistance")){
            var maxDistance = parseFloat(body.maxDistance);
            var query = Hittup.find({
                loc: {
                    $nearSphere: [longitude, latitude],
                    $maxDistance: maxDistance //in kilometers
                }
            });

            query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
            query.exec(function (err, results) {
                if (err) {
                    return res.send("Error Find: " + err.message);
                }
                res.send(getAvailableHittups(uid, results));
            });
        }
        else {
            //TODO use promises, async callback here has no use
            geoReverseLocation(coordinates, function(location){
                var query = Hittup.find({"loc.city": location.city, "loc.state": location.state});
                query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
                query.exec(function (err,results) {
                    if(err){
                        return res.send(err);
                    }
                    res.send(getAvailableHittups(uid, results));
                });
            });
        }//end else if user didn't specify maxDistance
    } else {
        res.send("MongoDB not Connected");
    }
});

// Post
router.post('/PostHittup', function (req, res, next) {
    var body = req.body;
    var hittup = new Hittup({
        title: body.title,
        isPrivate: (body.isPrivate.toLowerCase() == "true"),
        owner: body.owner,
        duration: parseInt(body.duration),
        dateCreated: Math.floor(Date.now()/1000),
        loc: {
            type: "Point",
            coordinates: [parseFloat(body.coordinates[0]), parseFloat(body.coordinates[1])]
        }
    });
    
    if(body.hasOwnProperty("usersInvited")){
        hittup.usersInvited = body.usersInvited;
    }
    geoReverseLocation(hittup.loc.coordinates, function(location){
        hittup.loc.city = location.city;
        hittup.loc.state = location.state;
        hittup.save(function (err) {
            if (err) {
                return res.send("Save Error: " + err.message);
            } 
            res.send("Successful save!")
        });
    });
}); 


module.exports = router;
