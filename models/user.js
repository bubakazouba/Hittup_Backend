// app/models/user.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var UserSchema   = new Schema({
    uid: String, 
    fbid: String,
    firstName: String,
    lastName: String,
    location: {
			longitude: double,
			latitude: double,
			city: String,
			state: String,
		}
});
module.exports = mongoose.model('User', UserSchema);