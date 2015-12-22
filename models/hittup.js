// app/models/hittup.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;
var User = require('../models/user');

var HittupSchema   = new Schema({

	title: String,
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	isPrivate: Boolean,
	duration: Number,
	dateCreated: Number,
	loc: {
		coordinates: { type: [Number], index: '2d' }
	},
	city: String,
	usersInvited: [{type: Schema.Types.ObjectId, ref: 'User'}],
	usersJoined: [{type: Schema.Types.ObjectId, ref: 'User'}]

});

module.exports = mongoose.model('Hittup', HittupSchema);