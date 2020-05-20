'use strict';

const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors');
const probe = require('kube-probe');
const http = require('http')
const cloudevent = require('cloudevents-sdk')
const HTTPBinary = require('cloudevents-sdk/lib/bindings/http/emitter_binary_1.js')

// notify the event sink we have started
console.log("Checking for K_SINK " + process.env.K_SINK);
if (process.env.K_SINK != null)
{
    const myevent = new CloudEvent()
          .source('web-coolstore')
          .type('web-wakeup')
          .dataContentType('application/json')
          .addExtension("coolstore.compnent", "web")
          .time(new Date())
          .data('{"msg": "GOOD MORNING VIETNAM"}')

      const emitter = new HTTPBinary({
          method: 'POST',
          url: process.env.K_SINK
      }).emitter

    emitter.emit(myevent).then((res) => {
        console.log(`Sent event: ${JSON.stringify(newCloudEvent.format(), null, 2)}`)
        console.log(`K_SINK responded: ${JSON.stringify({ status: res.status, headers: res.headers, data: res.data }, null, 2)}`)
    })
//      const req = http.request(options, res => {
//        console.log(`Broker response statusCode: ${res.statusCode}`)
//      })

//      req.on('error', error => {
//        console.log("Failed to contact SINK " + process.env.K_SINK + " Error: " + error);
//      })

//    req.write("")
//      req.end()

}

// Environment Variables
const gulp = require('gulp'); // Load gulp
const gulpfile = require('./gulpfile'); // Loads our config task
// Kick of gulp 'config' task, which generates angular const configuration
gulp.series(gulp.task('config'))();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable CORS support
app.use(cors());

// error handling
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
});

app.use('/', express.static(path.join(__dirname, 'views')));
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Add a health check
probe(app);


module.exports = app;
