var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrysSchema = new Schema({
	name:String,
    abbreviation:String,
	descript:String,
    states:[{type: mongoose.Schema.Types.ObjectId, ref: 'states'}],
    createdAt: {type:Date,default:Date.now},
    updatedAt: Date
})

countrysSchema.index({ name: 1}, { unique: true,sparse:true});
module.exports = mongoose.model('countrys', countrysSchema);