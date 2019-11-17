const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now,required: true },
    externalId: { type: String, required: true },
    data: {type: String, default:'', required:true}
},{
    versionKey: false
});

module.exports = mongoose.model('Record', recordSchema);