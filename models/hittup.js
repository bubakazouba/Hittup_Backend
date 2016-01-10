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
    	type: { type: String },
    	 coordinates: [ ] ,// [<longitude>, <latitude>]
    	 city: String,
    	 state: String,
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

}, {collection: 'Hittups'});

HittupSchema.index({ loc: '2dsphere' });
module.exports = mongoose.model('Hittup', HittupSchema);