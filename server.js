const express = require('express'),
    mongoose = require('mongoose'),
    mongo = require('mongodb'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cons = require('consolidate'),
    swig = require('swig'),
    path = require('path'),
    app = express();

// Bypasses Access-Control-Allow-Origin
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

// Support JSON and URL-encoded bodies
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
            extended: true
    }));

// Schemas
var User = require('./models/user.js'),
    Excuse = require('./models/excuse.js');

// Start server (localhost:3000)
app.listen(3000);
console.log('Listening on port 3000');

// Connect to the DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://473:project1@ds039674.mlab.com:39674/cpsc473');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mlab 473 Database");
});

// View Engine Setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Main route
app.get('/', function(req, res) {
  res.render('index');
});

// Excuse post
app.post("/submitExcuse", function(req, res) {
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

// Get the list of excuse posts from the database
app.get("/getExcuses", function(req, res) {
  Excuse.find({}, function(err, excuses) {
      var excuseMap = {};
      excuses.forEach(function(excuse) {
          excuseMap[excuse._id] = excuse;
      });
      res.json(excuseMap);
  });
});
