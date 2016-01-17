var express = require('express');
var router = express.Router();
var mongodb = require('../modules/db');
var ObjectID = require('mongodb').ObjectID;
var geolocation = require('../modules/geolocation');
var mongoose = require('mongoose');
var Logger = require('../modules/Logger');

function getAvailableHittups(uid,hittups) {
    var availableHittups = [];
    for (var i = hittups.length - 1; i >= 0; i--) {//TODO: include that in the query
        if(hittups[i].isPrivate == true) {
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
    var body = req.body;
    var inviteruid = body.inviteruid;
    var hittupuid = body.hittupuid; 
    var friendsuids = body.friendsuids;
    var friendsuidsReferences = []
    for (var i = friendsuids.length - 1; i >= 0; i--) {
        friendsuidsReferences.push(ObjectID(friendsuids[i]))
    }

    HittupSchema.findByIdAndUpdate(ObjectID(hittupuid), {
        $addToSet: { // prevent having duplicates
            "usersInvited": {
                $each: friendsuidsReferences
            }
        }},
        function(err, idk){
            if(err){
                Logger.log(err.message,req.connection.remoteAddress, inviteruid, "function: invite");
                return callback({"success": false, "error": err.message});
            }
            callback({"success": true})
        }
    );
}



function join(HittupSchema, req, callback) {
    var body = req.body;
    var owneruid = body.owneruid;
    var hittupuid = body.hittupuid;
    FriendHittups.findByIdAndUpdate(
        ObjectID(hittupuid),
        {
            $push: { //try without quotes
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
    var updateFields = ["title", "duration", "isPrivate"]
    var hittupToUpdate = {}
    for(var prop in body) {
        if(updateFields.indexOf(prop) != -1) { //if we should update it
            hittupToUpdate[prop] = body[prop]
        }
    }

    if(body.hasOwnProperty("coordinates")){ //TODO: refactor that
        hittupToUpdate.loc = {
            type: "Point",
            coordinates: body.coordinates
        }
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

function get(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}
    var body = req.body;
    var uid = body.uid;
    var query = HittupSchema.findById(ObjectID(uid));
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

function getAll(HittupSchema, req, callback) {
    if(!mongodb.db) {return callback({"success": false, "error": "DB not connected"});}
    var body = req.body;
    var uid = body.uid;
    var coordinates = body.coordinates;
    var timeInterval = 24*60*60; //TODO: better name for this variable
    if(body.hasOwnProperty("timeInterval")) {
       timeInterval = body.timeInterval;
    }
    if(body.hasOwnProperty("maxDistance")) {
        var maxDistance = body.maxDistance;
        var query = HittupSchema.find({
            loc: {
                $nearSphere: coordinates,
                $maxDistance: maxDistance //in kilometers
            }
        });
        query.populate({
            path: 'owner usersInvited usersJoined',
            select: 'firstName lastName fbid'
        });
        query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
        query.lean();
        query.exec(function (err, results) {
           if (err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "function: getAll");
                return callback({"success": false, "error":err.message});
           }
           callback(getAvailableHittups(uid, results));
        });
    }
    else {
         //TODO use promises, async callback here has no use
        geolocation.geoReverseLocation(coordinates, function (err, location) {
            if(err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "function: getAll");
                return callback({"success": false, "error": err.message});
            }
            var query = HittupSchema.find({"loc.city": location.city, "loc.state": location.state});
            query.where('dateCreated').gte(Date.now()/1000 - timeInterval);
            query.populate({
                path: 'owner usersInvited usersJoined',
                select: 'firstName lastName fbid'
            });
            query.lean();
            query.exec(function (err,results) {
               if(err) {
                   return callback({"success": false, "error": err.message});
               }
               callback(getAvailableHittups(uid, results));
            });
        });
    }//end else if user didn't specify maxDistance
}

function post(HittupSchema, req, callback) {
    var body = req.body;
    var hittup = new HittupSchema({
        owner: ObjectID(body.uid),
        title: body.title,
        isPrivate: body.isPrivate,
        duration: body.duration,
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
    }
    geolocation.geoReverseLocation(hittup.loc.coordinates, function (err, location) {
        hittup.loc.city = location.city;
        hittup.loc.state = location.state;
        hittup.save(function (err, insertedHittup) {
            if (err) {
                Logger.log(err.message,req.connection.remoteAddress, null, "function: post");
                console.log("Save Error: " + err.message);
                return callback({"success": false, "error": err.message});
            } 
            callback({"success": true, "uid": insertedHittup.id});
        });
    });
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
    get: get,
    post: post,
    getInvitations: getInvitations,
    invite: invite,
	update: update,
    remove: remove,
    getAll: getAll,
    unjoin: unjoin
};