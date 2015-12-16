var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hittup Rest API' });
});

router.get('/hittup', function(req, res){
	res.send('respond with hittup');
});

module.exports = router;
