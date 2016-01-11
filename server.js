var app = require('express')();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var hittups = require('./routes/FriendHittups');
var events = require('./routes/EventHittups');


// Connect to MongoDB
var mongodb = require('./modules/db');
mongodb.connect('mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup', function() {
    console.log('Connected to MongoDB.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);
app.use('/Users', users);
app.use('/FriendHittups', hittups);
app.use('/EventHittups', events);


PORT = 8080;

var server = app.listen(PORT, function () {
  var port = server.address().port;

  console.log('Magic happens at ' + port);
});
