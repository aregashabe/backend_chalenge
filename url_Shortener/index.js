require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns'); // Import the DNS module
const app = express();

// Basic Configuration
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json()); // Middleware to parse incoming JSON payloads

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory store for URLs
let urlDatabase = [];
let shortUrlCounter = 1;

// Function to validate URL using DNS lookup
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return Promise.reject('Invalid URL format. Must use http:// or https://');
    }

    const { hostname } = parsedUrl;
    return new Promise((resolve, reject) => {
      dns.lookup(hostname, (err) => {
        if (err) reject('Invalid URL or Domain does not exist');
        else resolve(true);
      });
    });
  } catch (error) {
    return Promise.reject('Invalid URL');
  }
};

// POST /api/shorturl to create short URL
app.post('/api/shorturl', async function(req, res) {
  const { original_url } = req.body;

  // Validate the URL
  try {
    await isValidUrl(original_url);
  } catch (error) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // Create a short URL
  const short_url = shortUrlCounter++;
  urlDatabase.push({ original_url, short_url });

  // Return the original and short URL
  res.json({ original_url, short_url });
});

// GET /api/shorturl/:short_url to redirect to the original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const short_url = parseInt(req.params.short_url);
  const urlEntry = urlDatabase.find(entry => entry.short_url === short_url);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});