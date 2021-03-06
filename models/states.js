var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statesSchema = new Schema({
  name:String,
  abbreviation:String,
  descript:String,
  order:{type:Number,default:1},
  country:{type: mongoose.Schema.Types.ObjectId, ref: 'countrys'},
  citys:[{type: mongoose.Schema.Types.ObjectId, ref: 'citys'}],
   createdAt: {type:Date,default:Date.now},
    updatedAt: Date
})

statesSchema.index({ name: 1}, { unique: true,sparse:true});
module.exports = mongoose.model('states', statesSchema);