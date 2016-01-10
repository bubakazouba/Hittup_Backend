// app/models/hittup.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;


//TODO: fix duplicating the `user` type
    
var HittupSchema   = new Schema({
	title: String,
    isPrivate: Boolean,
    duration: Number,
    dateCreated: Number,
    owner: { type: Schema.ObjectId, ref: 'User' },
    loc: { 
     type: { type: String },
      coordinates: [ ] ,// [<longitude>, <latitude>]
      city: String,
      state: String,
    },
    usersInvited: [{ type: Schema.ObjectId, ref: 'User' }],
    usersJoined: [{ type: Schema.ObjectId, ref: 'User' }]
}, {collection: 'Hittups'});

HittupSchema.index({ loc: '2dsphere' });
module.exports = mongoose.model('Hittups', HittupSchema);