// app/models/event.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

    
var EventSchema   = new Schema({

    title: String,
    orgName: {
        name: String
    },
    duration: Number,
    dateCreated: Number,
    loc: { 
    	type: { type: String },
    	 coordinates: [ ] ,// [<longitude>, <latitude>]
         address: String,
    	 city: String,
    	 state: String,
    },
    isPrivate: Boolean,
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

}, {collection: 'Events'});

EventSchema.index({ loc: '2dsphere' });
module.exports = mongoose.model('Event', EventSchema);