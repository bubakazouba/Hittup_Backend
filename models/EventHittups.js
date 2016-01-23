var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;


//TODO: fix duplicating the `user` type

var EventSchema   = new Schema({
    title: String,
    isPrivate: Boolean,
    duration: Number,
    dateCreated: Number,
    images: [{
      lowQualityImageurl: String,
      highQualityImageurl: String
    }],
    owner: { type: Schema.ObjectId, ref: 'Users' },
    category: String,
    loc: { 
      type: { type: String },
      coordinates: [ ] ,// [<longitude>, <latitude>]
      city: String,
      state: String,
    },
    usersInvited: [{ type: Schema.ObjectId, ref: 'Users' }],
    usersJoined: [{ type: Schema.ObjectId, ref: 'Users' }]
}, {collection: 'EventHittups'});

EventSchema.index({ loc: '2dsphere' });
module.exports = mongoose.model('EventHittups', EventSchema);