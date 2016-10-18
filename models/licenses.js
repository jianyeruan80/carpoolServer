var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
      address: String,
      city: String,
      state: String,
      zipcode: String,
      description:String
});
var licensesSchema = new mongoose.Schema({ 
    licenseKey:{type:String},
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    user:String
    },
    merchantId:String,
    month:{type:Number,default:3},
    active:{type:Boolean,default:false} ,
    startDate:Date,
    expires:Date,
    
    email:String,
    phone:String,
    contact:String,
    addressInfo:addressSchema,

});

licensesSchema.index({merchantId: 1 }, { unique: true,sparse:true});
module.exports = mongoose.model('licenses', licensesSchema);