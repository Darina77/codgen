'use strict';
var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var kafka = require('kafka-node');
var app = require('express')();
var bodyParser = require('body-parser');
var startGeneration = require('api/controllers/codgen');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  app.use(bodyParser.json());
  var shema = promisify(fs.readFile)('./schemaFromFractal.json', "utf-8");
  var Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client),
    payloads = [
      { topic: 'codgenFrom', partition: 0 }
    ];

  var Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
      client,
      [
          { topic: 'codgenTo', partition: 0}
      ],
      {
          autoCommit: false
      }
  );

  consumer.on('message', function (message) {
    var req;
    startGeneration(message, req);
    producer.send(
    [
      { topic: 'codgenTo', messages: [req]}
    ], 
    function (err, result) 
    {
      console.log(err || result);
      process.exit();
    });
  });

  producer.on('ready', function () {
      console.log('Producer is ready');
  });
  
  producer.on('error', function (err) {
      console.log('Producer is in error state');
      console.log(err);
  })

  app.get('/',function(req,res){
    res.json({greeting:'Kafka Consumer'})
  });

  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port, function(){
    console.log('Kafka producer running at 10010');
  });
});
