// Project 1 for Unlamented Something - Share excuses for missing class
//
var express = require('express'),
      expressValidator = require('express-validator'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      mongo = require('mongodb'),
      session = require('express-session'),
      passport = require('passport'),
      flash = require('connect-flash'),
      path = require('path'),
      exphbs = require('express-handlebars'),
      LocalStrategy = require('passport-local').Strategy;

// Create our routes & Schema vars
var routes = require('./routes/index'),
    users = require('./routes/users'),
    User = require('./models/user'),
    excuses = require('./routes/excuses'),
    Excuse = require('./models/excuse');


// Initialize our app
var app = express();

// Set view path directory
app.set('views', path);
app.set('views', path.join(__dirname, 'views'));

// Set public directory
app.use(express.static(path.join(__dirname, 'public')));

//Set our view engine as handlebars
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Connect to the database
mongoose.connect('mongodb://473:project1@ds039674.mlab.com:39674/cpsc473');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mlab 473 Project 1 Database");
});

// Body Parser for JSON & URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// Creates our session
app.use(session({
	secret: 'secret', //whatever we want as the super secret secret
	resave: true,
  	saveUninitialized: true
}));

// Initialize passport - used for our authentication
app.use(passport.initialize());
app.use(passport.session());

//Express Validator - Copied from express-validator documentation
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect flash for our messages
app.use(flash());

// Global vars for flash messages
app.use(function (req, res, next) {
  // We'll use this to display success and error messages when we render pages
  	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
  //passport sets its own error msg that's why this one is necessary
	res.locals.error = req.flash('error');
	next();
});

// Set our routes
app.use('/', routes);
app.use('/users', users);
app.use('/excuses', excuses);

app.listen(3000);
console.log('Listening on port 3000');
