var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var followcardSchema = new Schema({
floor : Number,
userName : String,
sendcard : String,
create_date : { type: Date, default: Date.now},
content : String
});
var followcard = mongodb.mongoose.model("followcard", followcardSchema);
var followcardDAO = function(){};
followcardDAO.prototype.get = function(sendcard,callback) {
	followcard.find({sendcard : sendcard} , callback);
};
followcardDAO.prototype.save = function(obj) {
	var instance = new followcard(obj);
	instance.save();
};
followcardDAO.prototype.floors = function(id,callback) {
	followcard.count({sendcard : id}, function(err, c){
       callback(c);
  });
};
module.exports = new followcardDAO();