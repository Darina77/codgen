'use strict';

var kafka = require('kafka-node');
var app = require('express')();
var bodyParser = require('body-parser');

const fs = require("fs");
const { promisify } = require("util");
const produserClient = new kafka.Client();
const consumerClient = new kafka.Client();
const topics = [
  {
      topic: "codgenRes"
  }   
];

const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: "buffer"
};

app.use(bodyParser.json());
const producer = new kafka.HighLevelProducer(produserClient);
const consumer = new kafka.HighLevelConsumer(consumerClient, topics, options);

var port = process.env.PORT || 5068;

app.listen(port, function(){
  console.log('Kafka producer running at 5068');
});

producer.on("error", function(error) {
  console.error(error);
});

producer.on("ready", function(){
  const event = promisify(fs.readFile)('./schemaFromFractal.json', "utf-8");

  event.then(function(result){
    setInterval(function(){
  const record = [
    { 
      topic: "codgen",
      messages: result,
      attributes: 1
    }
  ];
    producer.send(record, function(err, data){
      console.log(data);
    });
    console.log("Produser send")
    //console.log(result);
  }, 10000);
});
 
consumer.on("message", function(message) {
  console.log("Produser consumer get message");
  var buf = new Buffer(message.value, "binary");
  var decodedShema = JSON.parse(buf.toString());
  console.log(decodedShema);
});

consumer.on("error", function(err) {
  console.log("error", err);
});

});