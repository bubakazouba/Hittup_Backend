var app = require('express')();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var Users = require('./routes/Users');
var FriendHittups = require('./routes/FriendHittups');
var EventHittups = require('./routes/EventHittups');
var FriendAndEventHittups = require('./routes/FriendAndEventHittups');

// Connect to MongoDB
var mongodb = require('./modules/db');
mongodb.connect('mongodb://Hittup:katyCherry1738@ds043981.mongolab.com:43981/hittup', function () {
    console.log('Connected to MongoDB.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);
app.use('/Users', Users);
app.use('/FriendHittups', FriendHittups);
app.use('/EventHittups', EventHittups);
app.use('/FriendAndEventHittups', FriendAndEventHittups);

PORT = 8080;
var server = app.listen(PORT, function () {
  var port = server.address().port;

  console.log('Magic happens at ' + port);
});
