// app/models/user.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var UserSchema   = new Schema({
    fbid: String,
    firstName: String,
    lastName: String,
    location: {
        coordinates: {
            type: [Number],  // [<longitude>, <latitude>]
            index: '2dsphere'      // create the geospatial index
        },
        city: String,
        state: String
    },
    fb_friends: [{
        uid: String,
        fbid: String,
        firstName: String,
        lastName: String
    }],
});
module.exports = mongoose.model('User', UserSchema);