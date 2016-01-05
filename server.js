var app = require('express')();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var hittups = require('./routes/hittups');

// Connect to MongoDB
var mongodb = require('./db');
mongodb.connect('mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup', function() {
    console.log('Connected to MongoDB.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);
app.use('/users', users);
app.use('/hittups', hittups);

PORT = 8080;

var server = app.listen(PORT, function () {
  var port = server.address().port;

  console.log('Magic happens at ' + port);
});
