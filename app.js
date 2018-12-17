'use strict';
var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var kafka = require('kafka-node');
var app = require('express')();
var bodyParser = require('body-parser');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  
  //add swagger ui
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  app.use(bodyParser.json());
  var Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client);
  
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

  app.listen(5001,function(){
    console.log('Kafka producer running at 5001')
  });
  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});
