var mosca = require("mosca");
var recordController = require("./api/controllers/recordController");
var deviceController = require("./api/controllers/deviceController");
var sceneController = require("./api/controllers/sceneController");
var _ = require("lodash");
var settings = {
  port: 1885
};

var broker = new mosca.Server(settings);

broker.on("ready", function() {
  console.log("Broker is ready");
});

broker.on("published", function async(packet, client) {
  var parsed;
  console.log(packet.payload.toString());
  try {
    parsed = JSON.parse(packet.payload.toString());
    if (parsed["clientId"]) {
      parsed = undefined;
    }
  } catch {}
  if (parsed !== undefined) {
    try {
      //console.log("PARSED", parsed)
      recordController.newMQTT(parsed);
    } catch (e) {}
    // deviceController.getByID(parsed.ID, function(device){
    //     if(device){
    //         //console.log('Device founded', device);
    //         sceneController.viewById(device._id,function(scene){
    //             if(scene){
    //                 //console.log('Scene founded', scene);

    //                 parsed.data.abnormal=[];
    //                 _.forEach(scene.params, function(param){
    //                     if(parsed.data.hasOwnProperty(param.prop)){
    //                         switch (param.criticalVal.split(" ")[0]){
    //                             case '>':
    //                                     if(parsed.data[param.prop].toString()>param.criticalVal.split(" ")[1].toString()){
    //                                         parsed.data.abnormal.push(param.prop.toString());
    //                                         //console.log('ALERT',parsed)
    //                                     }
    //                                 break;
    //                             case '<':
    //                                     if(parsed.data[param.prop].toString()<param.criticalVal.split(" ")[1].toString()){
    //                                         parsed.data.abnormal.push(param.prop.toString());
    //                                         //console.log('ALERT',parsed)
    //                                     }
    //                                 break;
    //                             case '=':
    //                                     if(parsed.data[param.prop].toString()==param.criticalVal.split(" ")[1].toString()){
    //                                         parsed.data.abnormal.push(param.prop.toString());
    //                                         //console.log('ALERT',parsed)
    //                                     }
    //                                 break;
    //                         }
    // if(param.criticalVal.split(" ")[0]=='>'){
    //     if(parsed.data[param.prop]>param.criticalVal.split(" ")[1]){
    //         console.log('ALERT')
    //     }
    // }
    // else if(param.criticalVal.split(" ")[0]=='<'){
    //     if(parsed.data[param.prop]<param.criticalVal.split(" ")[1]){
    //         console.log('ALERT')
    //     }
    // }
    // else if(param.criticalVal.split(" ")[0]=='='){
    //     if(parsed.data[param.prop]==param.criticalVal.split(" ")[1]){
    //         console.log('ALERT')
    //     }
    // }
    //                     }
    //                 })
    //                 // try{
    //                 //     //console.log("PARSED", parsed)
    //                 //     recordController.newMQTT(parsed);
    //                 // }
    //                 // catch(e){}
    //                 //console.log('TEST');
    //                 //recordController.newMQTT(parsed);
    //             }
    //         })
    //     }
    //     // else{

    //     // }
    // })

    // try{
    //     console.log("PARSED", parsed)
    //     recordController.newMQTT(parsed);
    // }
    // catch(e){
    //     console.log(e);
    // }
    //console.log('Published',packet.topic, parsed.sensor);
  }
});

broker.on("clientConnected", function(client) {
  console.log("Client Connected:", client.id);
});

// fired when a client disconnects
broker.on("clientDisconnected", function(client) {
  console.log("Client Disconnected:", client.id);
});

module.exports = broker;
