const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now,required: true },
    updatedAt: { type: Date, default: Date.now,required: true },
    description: {type: String, default:''},
    title: {type: String, default:''},
    externalId: {type: String, default:'', unique:true}
},{
    versionKey: false
});

module.exports = mongoose.model('Device', deviceSchema);