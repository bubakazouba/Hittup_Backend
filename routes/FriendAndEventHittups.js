var express = require('express');
var router = express.Router();

var User = require('../models/Users');
var FriendHittups = require('../models/FriendHittups');
var EventHittups = require('../models/EventHittups');
var HittupHelper = require('../modules/HittupHelper');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Hello /FriendAndEventHittups!');
});

router.post('/GetHittups', function (req, res){
    HittupHelper.get(FriendHittups, req, function (friendHittups){
        HittupHelper.get(EventHittups, req, function (eventHittups){
            if (friendHittups.hasOwnProperty("success") && friendHittups.success == "false") {
                 return res.send(friendHittups);
            }

            if (eventHittups.hasOwnProperty("success") && eventHittups.success == "false") {
                 return res.send(eventHittups);
            }

            for (var i = friendHittups.length - 1; i >= 0; i--) {
                friendHittups[i].hittupType = "friend";
            };

            for (var i = eventHittups.length - 1; i >= 0; i--) {
                eventHittups[i].hittupType = "event";
            };

            console.log("event hittups");
            console.log(eventHittups);
            res.send({"success": "true", "hittups": eventHittups.concat(friendHittups)});
        });
    });
});


module.exports = router;