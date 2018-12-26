'use strict';
var kafka = require('kafka-node');
var app = require('express')();
var bodyParser = require('body-parser');
const {Codegen} = require('./api/controllers/codgen');
const consumerClient = new kafka.Client();
const produserClient = new kafka.Client();

const topics = [
    {
        topic: "codgen"
    }   
];

const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "buffer"
};

app.use(bodyParser.json());
const consumer = new kafka.HighLevelConsumer(consumerClient, topics, options);
const producer = new kafka.HighLevelProducer(produserClient);

var port = process.env.PORT || 5078;
app.listen(port, function(){
    console.log('Kafka consumer running at 5078');
});

consumer.on("message", function(message) {

    console.log("Consumer get message");
    var buf = new Buffer(message.value, "binary");
    var decodedShema = JSON.parse(buf.toString());
    //console.log(decodedShema);
    const codegen = new Codegen();  
    const code = codegen.generateFrom(decodedShema);
    
    code.then(function(result){
       console.log(result);
       var resJson = {"way" : "${result}"};
       const record = [
        { 
          topic: "codgenRes",
          messages: resJson,
          attributes: 1
        }
      ];
      producer.send(record, function(err, data){
        console.log(data);
      });
    });
    return code;
});

consumer.on("error", function(err) {
    console.log("error", err);
});
