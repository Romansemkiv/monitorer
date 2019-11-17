const mongoose = require('mongoose');

const sceneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now,required: true },
    updatedAt: { type: Date, default: Date.now,required: true },
    description: {type: String, default:''},
    title: {type: String, default:'', required: true},
    device: {type: mongoose.Schema.Types.ObjectId, ref: 'Device', required:true},
    params:[{
        title: String,
        prop: String,
        suffix: String,
        criticalVal: String, 
    }],
    options:{ 
        lastValue: Boolean,
        limit: Boolean,
        limitValue: Number,
        splitted: Boolean,
        bar: Boolean,
        irwinNum: Number,
        useIrwin: Boolean 
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Scene', sceneSchema);