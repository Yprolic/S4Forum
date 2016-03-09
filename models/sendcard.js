var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var sendcardSchema = new Schema({
boardID : String,
userName : String,
title : String,
create_date : { type: Date, default: Date.now},
content : String
});
var sendcard = mongodb.mongoose.model("sendcard", sendcardSchema);
var sendcardDAO = function(){};
sendcardDAO.prototype.get = function(board,callback) {
	sendcard.find({boardID : board} , callback);
};
sendcardDAO.prototype.save = function(obj) {
	var instance = new sendcard(obj);
	instance.save();
};
sendcardDAO.prototype.isSendcard = function(id, callback) {
	sendcard.findOne({_id : id} , callback);
};
module.exports = new sendcardDAO();