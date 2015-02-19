var mongoose = require('mongoose');
var users = require('../models/users');
var tvveets = require('../models/tvveets');

var mongoURI = process.env.MONGOURI || "mongodb://127.0.0.1:27017/test";
mongoose.connect(mongoURI);

var Users = mongoose.model('Users', users.usersSchema);
var Tvveets = mongoose.model('Tvveets', tvveets.tvveetsSchema);

var renderUsers = function(res, current_user){
	Users.find().exec(function (err, users){
        Tvveets.find().sort({_id: 1}).exec(function (err, tvveets){
            res.render('home', {"users": users,
                                "tvveets": tvveets,
                                "current_user": current_user});
        });
    });
}

var postTvveet = function(req, res){
    tvveet = new Tvveets();
    tvveet.text = req.body.text;
    tvveet.author = req.body.author;
    tvveet.author_id = req.body.author_id;
    
    tvveet.save(function (err){
        if(err){
            console.log(err);
        } else {
            console.log("new tvveet");
            res.json({id: tvveet.id});
        }
    });
}

var deleteTvveet = function(req, res){
    console.log(req.body.id);
    Tvveets.findOne({_id:req.body.id}).remove(function (err){
        if(err){
            console.log(err);
        } else {
            res.json({status: "deleted"});
        }
    })    
}

var getHome = function(req, res){
    Users.findById(req.user, function(err, user){
        if(err){
            console.log(err);
            current_user = undefined;
        } else if (user) {
            current_user = user;
        } else {
            current_user = undefined;
        }
        console.log(current_user);
        renderUsers(res, current_user);
    });
}

var getLogin = function(req, res){
    console.log("Going to login page")
    res.render('login',{});
}

module.exports.getHome = getHome;
module.exports.getLogin = getLogin;
module.exports.postTvveet = postTvveet;
module.exports.deleteTvveet = deleteTvveet;
