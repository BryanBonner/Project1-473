  var express = require('express');
  var router = express.Router();
  var Excuse = require('../models/excuse');
  var mongoose = require('mongoose');

  mongoose.connect('mongodb://473:project1@ds039674.mlab.com:39674/cpsc473');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Excuses opened it's own connection to Mlab 473");
  });
  var ObjectId = require('mongoose').Types.ObjectId;

  // POST - excuses
  router.post('/submitExcuse', function(req, res) {
    var excuse = new Excuse();
    excuse.title = req.body.title;
    excuse.postMaker = req.body.postMaker;
    excuse.users_id = req.body.user_id;
    excuse.excuse = req.body.excuse;
    console.log('posting excuse');
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
  router.get('/getExcuses', function(req, res) {
    var sortBy = req.query.sortBy;
    var action = {};

    action[sortBy] = -1;

    Excuse.find({}).sort(action).exec(function(err, excuses) {
      var excuseMap = {};

      excuses.forEach(function(excuse) {
        excuseMap[excuse._id] = excuse;
      });

      res.json(excuseMap);
    });
  });

  router.post('/increaseExcuseRating', function(req, res) {
    var updateField = "";
    var action = {};

    switch (req.body.rate) {
      case "L":
        updateField = "liked";
        break;
      case "G":
        updateField = "legit";
        break;
      case "E":
        updateField = "embarrassing";
        break;
      case "H":
        updateField = "hilarious";
        break;
      case "W":
        updateField = "cringeworthy";
        break;
    }
    action[updateField] = 1;
    action["voteCount"] = 1;

    db.collection('excuses').findAndModify(
      {"_id": ObjectId(req.body._id)}, {}, {$inc: action}, {}, 
      function(err, db) {
        if (err) {
          console.log(err);
          return res.status(500).send();
        }
        return res.status(200).send();
      }
    );
  });
module.exports = router;
