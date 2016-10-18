var mongoose = require('mongoose');
require('mongoose-schematypes-extend')(mongoose);
var Schema = mongoose.Schema;
var attendancesSchema = new Schema({
data:Date,
time_in:Date,
time_out:Date,
description:lauguagesSchema,
users:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

module.exports = mongoose.model('attendances', attendancesSchema);

