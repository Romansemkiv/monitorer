const mongoose = require("mongoose");
const Scene = require("../models/Scene");
const Device = require("../models/Device");

// Handle index actions
exports.all = async function(req, res) {
  Scene.find()
    .populate("device")
    .exec()
    .then(scenes => {
      res.status(200).json({
        scenes
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
  const scene = new Scene(req.body);
  scene._id = new mongoose.Types.ObjectId();
  await scene
    .save()
    .then(result => {
      return res.status(201).json({
        message: "Scene saved",
        document: result
      });
    })
    .catch(err => {
      return res.status(409).json({
        errors: err.toString()
      });
    });
};

// Handle view contact infoDevice
exports.view = async function(req, res) {
  Scene.findById(req.params.id)
    .exec()
    .then(result => {
      return res.status(201).json({
        message: "Scene founded",
        document: result
      });
    })
    .catch(err => {
      return res.status(409).json({
        errors: err.toString()
      });
    });
};

exports.viewById = async function(id, scen) {
  Scene.findOne({ device: id })
    .exec()
    .then(scene => {
      scen(scene);
    })
    .catch(err => {});
};

// Handle update contact info
exports.update = async function(req, res) {
  const updateOps = {};
  for (const ops of req.body.updateData) {
    updateOps[ops.propName] = ops.value;
  }
  updateOps.updatedAt = new mongoose.now();
  Scene.findByIdAndUpdate(req.params.id, { $set: updateOps }, { new: true })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Record updated",
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
  Scene.findByIdAndRemove(req.params.id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Scene deleted",
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
