var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var exphbs  = require("express-handlebars");
var passport = require("passport");
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./oauth.js');
var mongoose = require('mongoose');

var users_model = require("./models/users");
var Users = mongoose.model('Users', users_model.usersSchema);

var tvvitter  = require("./routes/tvvitter");
var users = require("./routes/users");

var app = express();

var PORT = process.env.PORT || 3001

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({ secret: 'my_precious'  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id)
        done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user){
        console.log('user: ' + user)
        if(!err) done(null, user);
            else done(err, null)
    })
});

app.get("/", tvvitter.getHome);
app.get("/login", tvvitter.getLogin);

app.post("/tvveet", tvvitter.postTvveet);
app.post("/delete", tvvitter.deleteTvveet);

app.get('/account', ensureAuthenticated, users.getAccount)
app.get('/auth/facebook',
    passport.authenticate('facebook')
);

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/'  }),
function(req, res) {
    res.redirect('/account');
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(PORT, function() {
  console.log("App running on port:", PORT);
});

//test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next();  }
    res.redirect('/')
}
