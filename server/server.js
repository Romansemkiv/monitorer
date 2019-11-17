const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const logger = require("morgan");
const bodyParser = require("body-parser");
const dbConection = require("./config/keys").database;
const mongoose = require("mongoose");
const cors = require("cors");
const broker = require("./MQTT_Broker.js");
const apiRoutes = require("./api/routes/api-routes");
var port = normalizePort(process.env.PORT || "4000");

app.set("port", port);

mongoose.connect(dbConection);
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.disable("etag");

app.use("/api/v1", apiRoutes);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.listen(app.get("port"), () => {
  console.log("Server listening on port %s", app.get("port"));
});

module.exports = { app, expressWs };
