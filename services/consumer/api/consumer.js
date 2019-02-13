const kafka = require('kafka-node');
const {
  startCodgenPlease
} = require('../controllers/codgenCreator');

(async () => {
  const kafkaClientOptions = {
    sessionTimeout: 100,
    spinDelay: 100,
    retries: 2
  };
  const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'consumer-client', kafkaClientOptions);

  const topics = [{
    topic: 'sales-topic'
  }];

  const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'buffer'
  };

  const kafkaConsumer = new kafka.HighLevelConsumer(kafkaClient, topics, options);

  kafkaConsumer.on('message', async function (message) {
    console.log('Message received:', message);
    const messageBuffer = new Buffer(message.value, 'binary');

    var decodedShema = JSON.parse(messageBuffer.toString());
    console.log('Decoded Shema:', decodedShema);

    startCodgenPlease(shema);
    console.log('Start codgen');
  });

  kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
  kafkaConsumer.on('error', (error) => console.error('Kafka consumer error:', error));
})();