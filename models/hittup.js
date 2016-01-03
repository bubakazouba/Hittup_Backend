// app/models/hittup.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;
// var User = require('./user');
//we need User + uid - (fbfriends and location)


//TODO: fix duplicating the `user` type
    
var HittupSchema   = new Schema({

    title: String,
    owner: {
        uid: String,
        fbid: String,
        firstName: String,
        lastName: String
    },
    isPrivate: Boolean,
    duration: Number,
    dateCreated: Number,
    loc: {
        coordinates: {
            type: [Number],  // [<longitude>, <latitude>]
            index: '2d'      // create the geospatial index
        },
        city: String,
        state: String
    },
    usersInvited: [{
        uid: String,
        fbid: String,
        firstName: String,
        lastName: String
    }],
    usersJoined: [{
        uid: String,
        fbid: String,
        firstName: String,
        lastName: String
    }]

}, {collection: 'Hittup'});

module.exports = mongoose.model('Hittup', HittupSchema);