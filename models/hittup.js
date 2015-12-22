// app/models/hittup.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;
var User = require('./user');

var HittupSchema   = new Schema({

	title: String,
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
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
	usersInvited: [{type: Schema.Types.ObjectId, ref: 'User'}],
	usersJoined: [{type: Schema.Types.ObjectId, ref: 'User'}]

});

module.exports = mongoose.model('Hittup', HittupSchema);