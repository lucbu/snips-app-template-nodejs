#!/usr/bin/env node

const mqtt = require('mqtt');
const ini = require('ini');
const fs = require('fs');

var CONFIG_INI = 'config.ini'
const configFile = fs.readFileSync('./'+CONFIG_INI, 'utf8')
const config = ini.parse(configFile)

var MQTT_IP_ADDR = "localhost";
var MQTT_PORT = 1883;
var options = {
  port: MQTT_PORT,
  keepalive : 60
};

function Template(playlist) {
  // connect to MQTT and subscribe intent
  client = mqtt.connect('mqtt://'+MQTT_IP_ADDR, options);
  this.start_blocking(client);
}

Template.prototype.start_blocking = function(client){
  client.on('connect', function () {
    // start listening to MQTT topic intents
    client.subscribe('hermes/intent/#');
  })

  // --> Master callback function, triggered everytime an intent is recognized
  var self = this;
  client.on('message', function (topic, message) {
    intent_message = JSON.parse(message.toString());
    self.master_intent_callback(client, intent_message)
  })
};

Template.prototype.master_intent_callback = function (client, message){

  var intent_name = intent_message.intent.intentName;

  switch (intent_name) {
    case 'intent_1':
      this.intent_1_callback(client, intent_message)
      break;
    default:
  }
};

// --> Sub callback function, one per intent
Template.prototype.intent_1_callback = function (client, intent_message) {

  // terminate the session first if not continue
  client.publish('hermes/dialogueManager/endSession', JSON.stringify({sessionId:intent_message.sessionId}));

  // action code goes here...
  console.log('[Received] intent: '+ intent_message.intent.intentName);

  // if need to speak the execution result by tts
  var val = {init: {type: 'notification', text: 'Action1 has been done', siteId: intent_message.siteId, customData: null}};
  client.publish("hermes/dialogueManager/startSession", JSON.stringify(val));
};


if (require.main === module) {
  new Template();
}


module.exports = Template;
