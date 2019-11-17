var recordController = require("./api/controllers/recordController");
var deviceController = require("./api/controllers/deviceController");
var sceneController = require("./api/controllers/sceneController");
var _ = require("lodash");

exports.newFromWS = async function(message) {
  var parsed;
  var added = false;
  try {
    //console.log('PPPP')
    parsed = JSON.parse(message);
    if (parsed["clientId"]) {
      parsed = undefined;
    }
  } catch {}
  if (parsed !== undefined) {
    // //console.log('PPPP')

    // deviceController.getByID(parsed.ID, function(device){
    //     if(device){
    //         //console.log('Device founded', device);
    //         sceneController.viewById(device._id,function(scene){
    //            // console.log('PPPP')

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
    //                     }
    //                 })
    try {
      console.log("PARSED", parsed);
      added = true;
      recordController.newMQTT(parsed);
      return added;
    } catch (e) {
      console.log(e);
    }
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
    return false;
  }
};
