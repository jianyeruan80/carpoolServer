var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var villagesSchema = new Schema({
  name:String,
  abbreviation:String,
  descript:String,
  order:{type:Number,default:1},
  town:{type: mongoose.Schema.Types.ObjectId, ref: 'towns'},
   createdAt: {type:Date,default:Date.now},
    updatedAt: Date
})

villagesSchema.index({ name: 1}, { unique: true,sparse:true});
module.exports = mongoose.model('villages', villagesSchema);