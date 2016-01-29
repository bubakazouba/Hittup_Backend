var express = require('express'),
    router = express.Router(),
    mongodb = require('../modules/db'),
    geolocation = require('../modules/geolocation'),
    mongoose = require('mongoose'),
    Logger = require('../modules/Logger'),
    ObjectID = require('mongodb').ObjectID,
    easyimg = require('easyimage'),
    fs = require('fs'),
    FriendHittupsSchema = require('../models/FriendHittups'),
    EventHittupsSchema = require('../models/EventHittups'),
    UsersSchema = require('../models/Users'),
    apn = require('../modules/apn');

var IMG_DIR_PATH = "./images";

function pushNotifyInvitations(HittupSchema, hittupTitle, friendsuidsReferences, inviterName){
    UsersSchema.find({_id: {$in: friendsuidsReferences}}, function (err, usersFound) {
        if (err) {
            Logger.log(err.message, "", "", "function: pushNotifyInvitations");
            return console.log(err);
        }
        deviceTokens = [];
        for (var i = usersFound.length - 1; i >= 0; i--) {
            for (var j = usersFound[i].deviceTokens.length - 1; j >= 0; j--) {
                deviceTokens.push(usersFound[i].deviceTokens[j]);
            }
        }
        apn.pushNotify(inviterName + " has invited you to \""+hittupTitle+"\"", deviceTokens);
    });
}

function getAvailableHittups(uid,hittups) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var availableHittups = [];
    for (var i = hittups.length - 1; i >= 0; i--) {//TODO: include that in the query
        if(hittups[i].isPrivate === true && hittups[i].owner._id.toString() != uid) {
            for (var j = hittups[i].usersInvited.length - 1; j >= 0; j--) {
                if(uid == hittups[i].usersInvited[j]._id.toString()) {
                    availableHittups.push(hittups[i]);
                }
            }
        }
        else {
            availableHittups.push(hittups[i]);
        }
    }
    return availableHittups;
}

function unjoin(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var body = req.body;
    var useruid = body.useruid;
    var hittupuid = body.hittupuid;

    HittupSchema.findByIdAndUpdate(ObjectID(hittupuid), 
        {
            $pull: {
                "usersJoined": ObjectID(useruid)
            }
        }, function (err, results) {
                if(err){
                    Logger.log(err.message,req.connection.remoteAddress, inviteruid, "function: invite");
                    return callback({"success": false, "error": err.message});
                }
                callback({"success": "true"});
            }
        ); //user $pullAll if there is more than one
}

function remove(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var body = req.body;
    var owneruid = body.owneruid;
    var hittupuid = body.hittupuid;

    HittupSchema.findById(ObjectID(hittupuid)).remove().exec(function (err, model){
        if(err){
            Logger.log(err.message,req.connection.remoteAddress, inviteruid, "function: invite");
            return callback({"success": false, "error": err.message});
        }
        callback({"success": "true"});
    });
}

function invite(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var body = req.body,
        inviteruid = body.inviteruid,
        hittupuid = body.hittupuid,
        hittupTitle = body.hittupTitle,
        friendsuids = body.friendsuids,
        inviterName = body.inviterName,
        friendsuidsReferences = [];

    for (var i = friendsuids.length - 1; i >= 0; i--) {
        friendsuidsReferences.push(new ObjectID(friendsuids[i]));
    }

    pushNotifyInvitations(HittupSchema, hittupTitle, friendsuidsReferences, inviterName);

    HittupSchema.findByIdAndUpdate(ObjectID(hittupuid), {
        $addToSet: { // prevent having duplicates
            "usersInvited": {
                $each: friendsuidsReferences
            }
        }},
        function(err, updatedHittup){
            if(err){
                Logger.log(err.message,req.connection.remoteAddress, inviteruid, "function: invite");
                return callback({"success": false, "error": err.message});
            }
            if(updatedHittup === null){
                Logger.log("hittup doesn't exist",req.connection.remoteAddress, inviteruid, "function: invite");
                return callback({"success": false, "error": "hittup doesn't exist"});
            }
            callback({"success": true});
        }
    );
}

function join(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var body = req.body;
    var owneruid = body.owneruid;
    var hittupuid = body.hittupuid;
    FriendHittups.findByIdAndUpdate(
        ObjectID(hittupuid),
        {
            $addToSet: { //try without quotes
                "usersJoined": {
                    "_id": ObjectID(owneruid)
                }
            }
        },
        function (err, updatedHittup) {
            if(err) {
                callback({"success": false, "error": err.message});
                return Logger.log(err.message,req.connection.remoteAddress, null, "function: PostHittup");
            }
            callback({"success": true});
        }
    );//end .update
}

function update(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}

    var body = req.body;
    var uid = body.uid;
    var updateFields = ["title", "duration", "isPrivate"];
    var hittupToUpdate = {};
    for(var prop in body) {
        if(updateFields.indexOf(prop) != -1) { //if we should update it
            hittupToUpdate[prop] = body[prop];
        }
    }

    if(body.hasOwnProperty("coordinates")){ //TODO: refactor that
        hittupToUpdate.loc = {
            type: "Point",
            coordinates: body.coordinates
        };
        geolocation.geoReverseLocation(hittupToUpdate.loc.coordinates, function (err, location) {
            hittupToUpdate.loc.city = location.city;
            hittupToUpdate.loc.state = location.state;
            HittupSchema.findByIdAndUpdate(ObjectID(uid), hittupToUpdate, function (err, updatedHittup) {
                if(err) {
                    callback({"success": false, "error": err.message});
                    return Logger.log(err.message,req.connection.remoteAddress, null, "function: PostHittup");
                }
                callback({"success": true});
            });//end .update
        });

    }
    else {
        HittupSchema.findByIdAndUpdate(ObjectID(uid), hittupToUpdate, function (err, updatedHittup) {
            if(err) {
                callback({"success": false, "error": err.message});
                return Logger.log(err.message,req.connection.remoteAddress, null, "function: PostHittup");
            }
            callback({"success": true});
        });//end .update
    }
}

function getFriendHittup(req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}

    var body = req.body;
    var uid = body.uid;
    var query = FriendHittupsSchema.findById(ObjectID(uid));
    query.populate({
        path: 'owner usersInvited usersJoined',
        select: 'firstName lastName fbid'
    });
    query.exec(function (err, hittup) {
        if (err) {
            callback({"success": false, "error":err.message});
            return Logger.log(err.message,req.connection.remoteAddress, null, "function: get");
        }
        callback(hittup);
    });
}

function getEventHittup(req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}

    var body = req.body;
    var uid = body.uid;
    var query = EventHittupsSchema.findById(ObjectID(uid));
    query.populate({
        path: 'usersInvited usersJoined',
        select: 'firstName lastName fbid'
    });
    query.populate({
        path: 'owner',
        select: 'name imageurl'
    });
    query.exec(function (err, hittup) {
        if (err) {
            callback({"success": false, "error": err.message});
            return Logger.log(err.message,req.connection.remoteAddress, null, "function: get");
        }
        callback(hittup);
    });
}

function getAllFriendHittups(req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}

    var body = req.body;
    var uid = body.uid;
    var query = UsersSchema.findById(ObjectID(body.uid));
    query.populate({
        path: 'fbFriends',
        select: 'fbid'
    });
    query.exec(function (err, foundUser) {
        if (err) {
            callback({"success": false, "error": err.message});
            return Logger.log(err.message,req.connection.remoteAddress, null, "function: get");
        }
        if(!foundUser) {
            return callback({"success": false, "error": "user not found"});
        }
        //get only hittups created by myself or my friends
        var uids = [ObjectID(foundUser.id)];
        for (var i = foundUser.fbFriends.length - 1; i >= 0; i--) {
            uids.push(ObjectID(foundUser.fbFriends[i].id));
        }
        var query = FriendHittupsSchema.find({"owner": {$in : uids} });
        query.populate({
            path: 'owner usersInvited usersJoined',
            select: 'firstName lastName fbid'
        });
        query.lean();
        query.exec(function (err,results) {
           if(err) {
               callback({"success": false, "error": err.message});
               return Logger.log(err.message,req.connection.remoteAddress, null, "function: get");
           }
           callback(getAvailableHittups(uid, results));
        });
    });
}

function getAllEventHittups(req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}
    var query = EventHittupsSchema.find({});
    query.where('dateStarts').gte(Date.now()/1000 - 24*60*60);
    query.populate({
        path: 'usersInvited usersJoined',
        select: 'firstName lastName fbid'
    });
    query.populate({
        path: 'owner',
        select: 'name imageurl'
    });
    query.lean();
    query.exec(function (err,results) {
       if(err) {
           callback({"success": false, "error": err.message});
           return Logger.log(err.message,req.connection.remoteAddress, null, "function: get");
       }
       callback(results);
    });
}

function base64_decode(base64str) {
    var bitmap = new Buffer(base64str, 'base64');
    return bitmap;
}

function getUniqueFileName(time) {
    time = typeof time !== 'undefined' ? time : Date.now();
    return time + '-' + Math.random();
}


function getImageurls(imageData, callback){
    var filedata = base64_decode(imageData);
    var uniqueFileName = getUniqueFileName();
    var HQFileName = uniqueFileName + '.jpg';
    var LQFileName = uniqueFileName + 'LQ.jpg';
    var HQImageFilePath = IMG_DIR_PATH + '/' + HQFileName;
    var LQImageFilePath = IMG_DIR_PATH + '/' + LQFileName;

    var HQImageurl = "http://ec2-52-53-231-44.us-west-1.compute.amazonaws.com/images/" + HQFileName;
    var LQImageurl = "http://ec2-52-53-231-44.us-west-1.compute.amazonaws.com/images/" + LQFileName;
    fs.writeFileSync(HQImageFilePath, filedata);
    easyimg.info(HQImageFilePath).then(
        function(file) {
            easyimg.thumbnail({
                src:HQImageFilePath, dst:LQImageFilePath,
                width: file.width,
                height: file.height,
                quality: 20
            }).then(function(image) {
                callback(HQImageurl, LQImageurl);
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
}
function postFriendHittup(req, callback) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var body = req.body;
    
    getImageurls(body.image, function (HQImageurl, LQImageurl) {
        var hittup = new FriendHittupsSchema({
            owner: ObjectID(body.uid),
            title: body.title,
            isPrivate: body.isPrivate,
            duration: body.duration,
            images : [{
                lowQualityImageurl: LQImageurl,
                highQualityImageurl: HQImageurl
            }],
            dateCreated: Math.floor(Date.now()/1000),
            loc: {
                type: "Point",
                coordinates: body.coordinates
            }
        });

        if(body.hasOwnProperty("usersInviteduids")) {
            usersInvitedReferences = [];
            for (var i = body.usersInviteduids.length - 1; i >= 0; i--) {
                usersInvitedReferences.push(ObjectID(body.usersInviteduids[i]));
            }
            hittup.usersInvited = usersInvitedReferences;
            pushNotifyInvitations(FriendHittupsSchema, title, usersInvitedReferences);
        }
        geolocation.geoReverseLocation(hittup.loc.coordinates, function (err, location) {
            hittup.loc.city = location.city;
            hittup.loc.state = location.state;
            hittup.save(function (err, insertedHittup) {
                if (err) {
                    callback({"success": false, "error": err.message});
                    return Logger.log(err.message,req.connection.remoteAddress, null, "function: post");
                } 
                callback({"success": true, "uid": insertedHittup.id});
            }); //end hittup.save
        }); //end geoLocation
    }); //end getImageurls
}


function postEventHittup(req, callback) {
    if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

    var body = req.body;
    getImageurls(body.image, function (HQImageurl, LQImageurl) {
        var hittup = new EventHittupsSchema({
            owner: ObjectID(body.uid),
            title: body.title,
            isPrivate: body.isPrivate,
            duration: body.duration,
            dateStarts: body.dateStarts,
            description: body.description,
            emoji: body.emoji,
            images : [{
                lowQualityImageurl: LQImageurl,
                highQualityImageurl: HQImageurl
            }],
            dateCreated: Math.floor(Date.now()/1000),
            loc: {
                type: "Point",
                coordinates: body.coordinates
            }
        });

        geolocation.geoReverseLocation(hittup.loc.coordinates, function (err, location) {
            hittup.loc.city = location.city;
            hittup.loc.state = location.state;
            hittup.save(function (err, insertedHittup) {
                if (err) {
                    callback({"success": false, "error": err.message});
                    return Logger.log(err.message,req.connection.remoteAddress, null, "function: post");
                } 
                callback({"success": true, "uid": insertedHittup.id});
            }); //end hittup.save
        }); //end geoLocation
    }); //end getImageurls
}

function getInvitations(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}

    // var body = req.body;
    // var timeInterval = 24*60*60; //TODO: better name for this variable
    // var uid = req.body.uid;
    // if(body.hasOwnProperty("timeInterval")) {
    //     timeInterval = body.timeInterval;
    // }
    // var query = HittupSchema.find({"usersInvited._id":  (req.body.uid)});

    // find({
    //     usersInvited: {
    //         $elemMatch: {
    //             uid: req.body.uid
    //         }
    //     }
    // })
    // var query = HittupSchema.find({
    //     usersInvited: {
    //         $elemMatch: ObjectID(req.body.uid)
    //     }
    // });
    // query.populate({
    //     path: 'usersInvited',
    //     select: 'firstName lastName fbid'
    // });
    // query.exec(function (err, results) {
    //     if (err) {
    //         callback({"success": false, "error": err.message});
    //         return Logger.log(err.message,req.connection.remoteAddress, null, "function: PostHittup");
    //     }
    //     console.log(results);
    //     callback(results);
    // });
}

module.exports = {
    getAllEventHittups: getAllEventHittups,
    getAllFriendHittups: getAllFriendHittups,
    getFriendHittup: getFriendHittup,
    getEventHittup: getEventHittup,
    postFriendHittup: postFriendHittup,
    postEventHittup: postEventHittup,
    getInvitations: getInvitations,
    invite: invite,
	update: update,
    remove: remove,
    unjoin: unjoin
};