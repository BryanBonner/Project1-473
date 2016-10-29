var express = require('express'),
	  router = express.Router(),
	  passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

// GET - Register
router.get('/register', function(req, res) {
	res.render('register');
})

// GET - login
router.get('/login', function(req, res) {
	res.render('login');
})

// Register User - gets data from the user end and validates it
router.post('/register', function(req, res) {
	var email = req.body.email,
	    username = req.body.username,
		  password = req.body.password,
		  password2 = req.body.password2; // For confirm password field

		//test if it's working -- delete this later
		console.log(email);

		// Validation
		req.checkBody('email', 'E-mail is required').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'passwords do not match').equals(req.body.password);

		// Test for errors example - delete the console logs later
		var errors = req.validationErrors();
		if(errors) {
			console.log('Yes there are errors');
		}
		else {
			console.log('there are no errors');
		}

		// After deleting the above error check - use this as a real check
		// Re-render the register page with the errors
		if(errors) {
			res.render('register', {
				errors:errors
			});
		} else {
			console.log('PASSED');
			//validation passed so lets create our new user
			var newUser = new User( {
			    email: email,
		      username: username,
			    password: password
			});

      // Create our user - throw an error if it fails
			User.createUser(newUser, function(err, user) {
				if(err) throw err;
					console.log(user);
			});

			// For this to work we need to create a placeholder in our layouts file
			// that checks all 3 of our global vars
			req.flash('success_msg', 'You are now registered and can login');
			res.redirect('/users/login');
		}
});

// Gets user name, checks for match in our db, validates the password
// Functions comparePassword & getUserByUsername found in models/user.js
passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username), function(err, user) {
  		if(err) throw err;

  		// Is there a user in our db?
  		if(!user) {
  			return done(null, false, {message: 'No User Found'});
  		}

      // Does password match?
  		User.comparePassword(password, user.password, function(err, isMatch) {
  			if(err) throw err;
  			if(isMatch) {
  				return done(null, user);
  			}
  			else {
  				return done(null, false, {message: 'Invalid Password'});
  			}
  		});
  	};
	}));

// Passport serialization
//Taken from official passport docs - getUserById found in our schema
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserbyId(id, function(err, user) {
		done(err, user);
	});
});

// POST login
// redirects to home page if accepted, otherwise to the login
router.post('login',
	//failureFlash true - we are using flash messages
	passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true}),
	function(req, res) {
		res.redirect('/');
	});

// Log the user out
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success_msg', 'Successfully logged out');

	//redirect to the login page after logging out
	res.redirect('/users/login');
});

module.exports = router;
