var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartypesSchema = new Schema({
  name:String,
  descript:String,
  
})

cartypesSchema.index({ name: 1}, { unique: true,sparse:true});
module.exports = mongoose.model('cartypes', cartypesSchema);