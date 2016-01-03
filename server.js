var app = require('express')();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

PORT = 3000;

var server = app.listen(PORT, function () {
  var port = server.address().port;

  console.log('Magic happens at ' + port);
});