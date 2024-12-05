// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// Serve static files from 'public' directory
app.use(express.static('public'));

// Serve main page
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint that returns a greeting
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// API endpoint to handle date requests
app.get("/api/:date?", function (req, res) {
  const dateParam = req.params.date;
  let date;

  // Check if date parameter is present
  if (!dateParam) {
    // If no date is provided, return the current date
    date = new Date();
  } else if (!isNaN(dateParam)) {
    // If dateParam is a number, treat it as a Unix timestamp
    date = new Date(parseInt(dateParam));
  } else {
    // Attempt to parse the date string
    date = new Date(dateParam);
  }

  // Check if date is valid
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  // Return the response with the Unix timestamp and UTC formatted date
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

// Start listening on the designated port
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});