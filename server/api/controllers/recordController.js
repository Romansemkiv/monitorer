const mongoose = require("mongoose");
const Record = require("../models/Record");

// Handle index actions
exports.all = async function(req, res) {
  Record.find()
    .sort({ createdAt: -1 })
    .exec()
    .then(records => {
      res.status(200).json({
        records
      });
    })
    .catch(err => {
      res.status(409).json({
        error: err
      });
    });
};

exports.lastByDeviceId = async function(req, res) {
  Record.findOne({ externalId: req.params.id })
    .sort({ createdAt: -1 })
    .exec()
    .then(record => {
      res.status(200).json({
        record
      });
    })
    .catch(err => {
      res.status(409).json({
        error: err
      });
    });
};

exports.lastNumByDeviceId = async function(req, res) {
  if (req.params.limit > 0) {
    Record.find({ externalId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(req.params.limit))
      .exec()
      .then(records => {
        res.status(200).json({
          records
        });
      })
      .catch(err => {
        res.status(409).json({
          error: err
        });
      });
  } else if (parseInt(req.params.limit) == -1) {
    Record.find({ externalId: req.params.id })
      .sort({ createdAt: -1 })
      .exec()
      .then(records => {
        res.status(200).json({
          records
        });
      })
      .catch(err => {
        res.status(409).json({
          error: err
        });
      });
  } else {
    return res.status(409).json({
      error: "Not valid limit value"
    });
  }
};

exports.recordsNumByDeviceId = async function(deviceId, num, rec) {
  if (num > 0) {
    Record.find({ externalId: deviceId })
      .sort({ createdAt: -1 })
      .limit(parseInt(num))
      .exec()
      .then(records => {
        rec(records);
      })
      .catch(err => {
        return err;
      });
  }
};

// Handle create contact actions
exports.new = async function(req, res) {
  const record = new Record({
    _id: new mongoose.Types.ObjectId(),
    externalId: req.body.ID,
    data: req.body.data
  });
  record
    .save()
    .then(result => {
      return res.status(201).json({
        message: "Record saved",
        document: result
      });
    })
    .catch(err => {
      return res.status(409).json({
        errors: err.toString()
      });
      Device;
    });
};

// Handle view contact infoDevice
exports.view = async function(req, res) {
  Record.findById(req.params.id)
    .exec()
    .then(result => {
      return res.status(201).json({
        message: "Record founded",
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
  Record.findByIdAndUpdate(req.params.id, { $set: updateOps }, { new: true })
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
  Record.findByIdAndRemove(req.params.id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Record deleted",
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

// Handle create contact actions
exports.newMQTT = async function(data) {
  const record = new Record({
    _id: new mongoose.Types.ObjectId(),
    externalId: data.ID,
    data: JSON.stringify(data.data)
  });
  record
    .save()
    .then(result => {
      return true;
    })
    .catch(err => {
      return false;
    });
};
