// app/models/user.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var UserSchema   = new Schema({
    uid: String, 
    fbid: String,
    firstName: String,
    lastName: String,
    location: {
		coordinates: {
		    type: [Number],  // [<longitude>, <latitude>]
		    index: '2dsphere'      // create the geospatial index
		},
		longitude: Number,
		latitude: Number,
		city: String,
		state: String,
	},
	fb_friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
});
module.exports = mongoose.model('User', UserSchema);