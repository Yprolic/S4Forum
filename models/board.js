var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var boardSchema = new Schema({
title : String,
name : String
});
var board = mongodb.mongoose.model("board", boardSchema);
var boardDAO = function(){};
boardDAO.prototype.isBoard = function(title, callback) {
	board.findOne({title : title} , callback);
};
boardDAO.prototype.get = function(callback) {
	board.find({} , callback);
};
module.exports = new boardDAO();