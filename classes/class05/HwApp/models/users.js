var mongoose = require("mongoose");

var usersSchema = mongoose.Schema({
        oauthID: Number,
		name: String,
});

module.exports.usersSchema = usersSchema;
