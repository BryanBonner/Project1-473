var express = require('express'),
	router = express.Router();

// Home Page
router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;
