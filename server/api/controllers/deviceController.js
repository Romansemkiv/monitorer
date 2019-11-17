const mongoose = require("mongoose");
const Device = require("../models/Device");

// Handle index actions
exports.all = async function(req, res) {
  Device.find()
    .exec()
    .then(devices => {
      res.status(200).json({
        devices
      });
    })
    .catch(err => {
      res.status(409).json({
        error: err
      });
    });
};

// Handle create contact actions
exports.new = async function(req, res) {
  const device = new Device({
    _id: new mongoose.Types.ObjectId(),
    type: req.body.type,
    description: req.body.description,
    title: req.body.title,
    externalId: req.body.externalId
  });
  device
    .save()
    .then(result => {
      return res.status(201).json({
        message: "Device saved",
        document: result
      });
    })
    .catch(err => {
      return res.status(409).json({
        errors: err.toString()
      });
    });
};

exports.getByID = async function(id, dev) {
  Device.findOne({ externalId: id })
    .exec()
    .then(device => {
      dev(device);
    })
    .catch(err => {});
};

// Handle view contact info
exports.view = async function(req, res) {
  Device.findById(req.params.id)
    .exec()
    .then(result => {
      return res.status(201).json({
        message: "Device founded",
        document: result
      });
    })
    .catch(err => {
      return res.status(409).json({
        errors: err.toString()
      });
    });
};

// Handle update contact info
exports.update = async function(req, res) {
  const updateOps = {};
  for (const ops of req.body.updateData) {
    updateOps[ops.propName] = ops.value;
  }
  updateOps.updatedAt = new mongoose.now();
  Device.findByIdAndUpdate(req.params.id, { $set: updateOps }, { new: true })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Device updated",
        updated: result
      });
    })
    .catch(err => {
      res.status(409).json({
        error: err
      });
    });
};

// Handle delete contact
exports.delete = async function(req, res) {
  Device.findByIdAndRemove(req.params.id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Device deleted",
        result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
