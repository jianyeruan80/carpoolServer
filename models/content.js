var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentsSchema = new Schema({
  
  country:String,
  state:String,

  type:String,
  picture:String,

  fee:String,
  description:String,
  contact:String,
  phone:String,
  email:String,

  destination:String,
  destinationAddress:String,
  arrivalTime:Date,
  createdAt: {type:Date,default:Date.now},
  updatedAt: Date,

  departure:String,
  departureAddress:String,
  departureTime:Date,

  tripSite:[String],
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  createdAt: {type:Date,default:Date.now},
  updatedAt: Date,
  status:{type:Boolean,default:false},

})
module.exports = mongoose.model('contents', contentsSchema);


