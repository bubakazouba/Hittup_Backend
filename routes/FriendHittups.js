var express = require('express');
var router = express.Router();

var FriendHittups = require('../models/FriendHittups');
var HittupHelper = require('../modules/HittupHelper');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Hello /Hittups!');
});

router.post('/GetHittups', function (req, res) {
    HittupHelper.get(EventHittups,req, function (result) {
        res.send(result);
    });
});

router.post('/InviteFriends', function (req, res){
    HittupHelper.invite(EventHittups, req, function (result){
        res.send(result);
    });
});

router.post('/JoinHittup', function (req, res) {
    HittupHelper.JoinHittup(EventHittups, req, function (result) {
        res.send(result);
    });
});


router.post('/GetInvitations', function (req, res) {
    HittupHelper.getInvitations(EventHittups, req, function (result) {
        res.send(result);
    });
});

router.post('/PostHittup', function (req, res, next) {
    HittupHelper.post(EventHittups, req, function (result) {
        res.send(result);
    });
}); 

module.exports = router;