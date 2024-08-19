const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const { URL } = require('url');
const Url = require('../models/Url');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/shorturl', async function(req, res) {
  const original = req.body.url;

  try {
    const urlObj = new URL(original);
    const hostname = urlObj.hostname;

    dns.lookup(hostname, async (err, address) => {
      if (err) {
        return res.json({ error: 'Invalid URL' });
      }
      
      let url = await Url.findOne({ originalUrl: original });
      
      if (!url) {
        const shortUrl = Math.random().toString(36).substring(2, 8);

        url = new Url({
          originalUrl: original,
          shortUrl: shortUrl
        });
        await url.save();
      }

      res.json({ originalUrl: url.originalUrl, shortUrl: url.shortUrl });
    });
  } catch (error) {
    res.json({ error: 'Invalid URL' });
  }
});

module.exports = app;