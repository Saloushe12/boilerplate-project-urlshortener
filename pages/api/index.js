require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

// Initialize Express App
const app = express();

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);
console.log(process.env.MONGO_URI);
console.log(process.env.PORT);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Serve Static Files
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve the main HTML file
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
