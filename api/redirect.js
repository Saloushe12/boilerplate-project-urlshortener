const express = require('express');
const Url = require('../models/Url');

const app = express();

app.get('/api/shorturl/:shortUrl', async function(req, res) {
  const shortUrl = req.params.shortUrl;
  const url = await Url.findOne({ shortUrl: shortUrl });

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

module.exports = app;