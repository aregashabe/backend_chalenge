// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// /api/whoami endpoint to return user's IP address, preferred language, and software
app.get('/api/whoami', function (req, res) {
  // Get the IP address
  const ipaddress = req.ip || req.headers['x-forwarded-for'] || 'Not Found';
  
  // Get the preferred language from the Accept-Language header
  const language = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'Not Found';
  
  // Get the software from the User-Agent header (extract the operating system)
  const software = req.headers['user-agent'] ? req.headers['user-agent'].split(') ')[0].split('(')[1] : 'Not Found';
  
  // Send the response with IP address, language, and software
  res.json({ ipaddress: ipaddress, language: language, software: software });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
