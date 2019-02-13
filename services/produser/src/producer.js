const _ = require('underscore');
const bodyParser = require('body-parser');
const express = require('express');
const Router = require('express-promise-router');
const kafka = require('kafka-node');

const kafkaClientOptions = {
  sessionTimeout: 100,
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

  if (_.isNaN(parsedTotal)) {
    res.status(400);
    res.json({
      error: 'Ensure total is a valid number.'
    });
    return;
  }

  const payload = [{
    topic: 'sales-topic',
    messages: shema
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

app.listen(process.env.PRODUCER_PORT);