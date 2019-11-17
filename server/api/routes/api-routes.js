let router = require("express").Router();
const websocket = require("../../WS");

router.get("/", function(req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to REST crafted with love!"
  });
});

router.ws("*", function(ws, req) {
  ws.on("message", function(msg) {
    if (websocket.newFromWS(msg)) {
    }
  });
});

let recordController = require("../controllers/recordController");

router
  .route("/record")
  .get(recordController.all)
  .post(recordController.new);

router
  .route("/record/:id")
  .get(recordController.view)
  .patch(recordController.update)
  .delete(recordController.delete);

router.route("/record/device/:id").get(recordController.lastByDeviceId);

router
  .route("/record/device/:id/:limit")
  .get(recordController.lastNumByDeviceId);

let deviceController = require("../controllers/deviceController");

router
  .route("/device")
  .get(deviceController.all)
  .post(deviceController.new);

router
  .route("/device/:id")
  .get(deviceController.view)
  .patch(deviceController.update)
  .delete(deviceController.delete);

let sceneController = require("../controllers/sceneController");

router
  .route("/scene")
  .get(sceneController.all)
  .post(sceneController.new);

router
  .route("/scene/:id")
  .get(sceneController.view)
  .patch(sceneController.update)
  .delete(sceneController.delete);

// router.route('/scene/by/device/:id')
//     .get(sceneController.deviceAll)

// router.route('/scene/by/device/:id')
//     .get(sceneController.deviceView)
//     .patch(sceneController.deviceUpdate)
//     .delete(sceneController.deviceDelete);

module.exports = router;
