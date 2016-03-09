var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var userSchema = new Schema({
	password : String,
	userName : String,
});
var user = mongodb.mongoose.model("user", userSchema);
var userDAO = function(){};
userDAO.prototype.save = function(obj) {
	var instance = new user(obj);
	instance.save();
};
userDAO.prototype.findByName = function(userName, callback) {
	user.findOne({userName : userName} , callback);
};
module.exports = new userDAO();