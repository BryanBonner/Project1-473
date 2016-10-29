var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    Excuse = require('../models/excuse');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// POST - excuses
router.post("/submitExcuse", function(req, res) {
    var excuse = new Excuse();
    excuse.title = req.body.title;
    excuse.postMaker = req.body.postMaker;
    excuse.users_id = req.body.user_id;
    excuse.excuse = req.body.excuse;
    console.log("posting excuse");
    excuse.save(function(err, savedExcuse) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(200).send();
    });

});

// GET - excuses
//get the list of excuse posts from the database
router.get("/getExcuses", function(req, res) {
    Excuse.find({}, function(err, excuses) {
        var excuseMap = {};

        excuses.forEach(function(excuse) {
            excuseMap[excuse._id] = excuse;
        });

        res.json(excuseMap);
    });
});

module.exports = router;
