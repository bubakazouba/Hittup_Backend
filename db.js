// Connect Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup'); // connect to our database


// Connect MongoClient
var mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup", function(err, db) {
    if (err) {
        console.log(err);
        return(err);
      }
      else{
        // console.log("success");
        module.exports = db;
        console.log("connected to db: " + db);
  }
});