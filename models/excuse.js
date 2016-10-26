var mongoose = require('mongoose');
    passportLocalMongoose = require('passport-local-mongoose');

var ExcuseSchema = new mongoose.Schema({
  title: String,
  postMaker: String,
  users_id: String,
  datePosted: { type: Date, default: Date.now },
  excuse: String,
  liked: { type: Number, default: 0 },
  legit: { type: Number, default: 0 },
  embarrassing: { type: Number, default: 0 },
  hilarious: { type: Number, default: 0 },
  cringeworthy: { type: Number, default: 0 }
});

ExcuseSchema.plugin(passportLocalMongoose);

// Points back to Excuse and in app.js
var Excuse = mongoose.model('Excuse', ExcuseSchema);
module.exports = Excuse;
