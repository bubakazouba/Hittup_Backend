// app/models/hittup.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var HittupSchema   = new Schema({

	title: String,
	owner: {
		uid: String,
		fbid: String,
		firstName: String,
		lastName: String,
	},
	isPrivate: Boolean,
	duration: Number,
	dateCreated: Number,
	location: [Number, Number],
	city: String,
	usersInvited: [{
			uid: String,
			fbid: String,
			firstName: String,
			lastName: String,
		}],
	usersJoined: [{
			uid: String,
			fbid: String,
			firstName: String,
			lastName: String,
		}]

});

module.exports = mongoose.model('Hittup', HittupSchema);