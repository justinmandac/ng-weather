const DARK_SKY_KEY = `ca4ba6ff8a0484c29e41a7b3b20e69cd`;

var express = require('express');
var app  = express();
var request  = require('request');
var http = require('http');
var cors = require('cors');

// app.use(cors);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res) {
  res.json({
    message: 'yo'
  });
});

app.get('/weather', function(req, res) {
  console.log(req.query);
  var queryParams = req.query;
  var hasCoords = queryParams.hasOwnProperty('latlng');
  var errResponse = {
    error: 1,
    data: ''
  };

  if(hasCoords) {
    let coords = queryParams.latlng;
    let units = queryParams.units;

    if(coords.length > 0) {
      let split = coords.split(',');
      let latitude = split[0].trim();
      let longitude = split[1].trim();
      let unitsString = units.length ? `?units=${units}` : '';

      let url = `https://api.darksky.net/forecast/${DARK_SKY_KEY}/${latitude},${longitude}${unitsString}`;

      console.log('OK:' + latitude + ',' + longitude);
      console.log('REQUEST_URL: ' + url);
      
      request(
        url,
        function(err, response, body) {
          if(err) {
            console.log(err);
            errResponse.data = 'API error';
            res.json(errResponse);
          } else {
            console.log(body);
            res.send(body);
          }
        });
    }
  }
});

app.listen(8888, function() {
  console.log('API Server Started');
});
