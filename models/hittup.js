// app/models/hittup.js
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var HittupSchema   = new Schema({
    FullName: String,
    Hittup_Header: String
});

module.exports = mongoose.model('Hittup', HittupSchema);