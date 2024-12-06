// Import required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// Serve the HTML file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// File upload route
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please select a file.' });
  }

  // Extract metadata
  const fileMetadata = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  };

  // Optional: Delete the file after processing to save space
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error('Error deleting uploaded file:', err);
    }
  });

  // Respond with the file metadata
  res.json(fileMetadata);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
