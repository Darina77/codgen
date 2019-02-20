const _ = require('underscore');
const bodyParser = require('body-parser');
const express = require('express');
const Router = require('express-promise-router');
const kafka = require('kafka-node');


const kafkaClientOptions = {
  sessionTimeout: 1000,
  spinDelay: 100,
  retries: 2
};
const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'producer-client', kafkaClientOptions);
const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);

kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
kafkaProducer.on('error', (error) => console.error('Kafka producer error:', error));

const app = express();
const router = new Router();

app.use('/', router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/codgen', (req, res) => {

  const shema = req.body;
  const messageBuffer = JSON.stringify(shema);

  const payload = [{
    topic: "codgen",
    messages: messageBuffer,
    attributes: 1
  }];

  kafkaProducer.send(payload, function (error, result) {
    console.info('Sent payload to Kafka:', payload);

    if (error) {
      console.error('Sending payload failed:', error);
      res.status(500).json(error);
    } else {
      console.log('Sending payload result:', result);
      res.status(202).json(result);
    }
  });
});

app.listen(process.env.PRODUCER_PORT, new function(){
  console.log("Produser start on port " + process.env.PRODUCER_PORT);
});