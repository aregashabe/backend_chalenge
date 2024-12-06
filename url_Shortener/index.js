require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3002;

// In-memory storage for URLs
let urlDatabase = [];
let nextId = 1;

// Middleware setup
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false })); // Body parser for form data

// Serve the HTML file
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoint to shorten URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format using regex
  const urlRegex = /^https?:\/\/(www\.)?.+\..+/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Verify URL using dns.lookup
  const urlObj = new URL(originalUrl);
  dns.lookup(urlObj.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Save the URL to the database
    const shortUrl = nextId++;
    urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

    // Respond with the required JSON format
    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});


// API endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl, 10); // Convert parameter to integer
  const urlEntry = urlDatabase.find((entry) => entry.short_url === shortUrl);

  if (urlEntry) {
    // Redirect to the original URL
    res.redirect(urlEntry.original_url);
  } else {
    // Return error if the short_url is not found
    res.status(404).json({ error: 'No short URL found for the given input' });
  }
});


// Start the server
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
