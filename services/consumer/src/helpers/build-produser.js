const _ = require('underscore');
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


startBuild = (buildParams) => {

  const messageBuffer = JSON.stringify(buildParams);

  const payload = [{
    topic: "build",
    messages: messageBuffer,
    attributes: 1
  }];

  kafkaProducer.send(payload, function (error, result) {
    console.info('Sent payload to Kafka:', payload);

    if (error) {
      console.error('Sending payload failed:', error);
      
    } else {
      console.log('Sending payload result:', result);
      
    }
    });
}

module.exports = {
    startBuild
};