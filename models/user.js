// app/models/user.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var UserSchema   = new Schema({
    fbid: String,
    firstName: String,
    lastName: String,
    fbToken: String,
    loc: { 
        type: { type: String },
         coordinates: [ ] ,// [<longitude>, <latitude>]
         city: String,
         state: String,
    },
    fbFriends: [{
        uid: String,
        fbid: String,
        firstName: String,
        lastName: String
    }],
}, {collection: 'Users'});
UserSchema.index({ loc: '2dsphere' });
module.exports = mongoose.model('User', UserSchema);
