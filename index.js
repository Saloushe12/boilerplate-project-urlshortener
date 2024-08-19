require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const { URL } = require('url');
const app = express();

const Url = require('./models/Url'); //Import Url Schema and Model
// Basic Configuration
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json()); // Parses json bodies
app.use(express.urlencoded( {extended: true} )); // Parses URL-encoded bodies

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async function(req, res) {
  const original = req.body.url;

  try {
    const urlObj = new URL(original);
    const hostname = urlObj.hostname;

    //Validate URL
    dns.lookup(hostname, async (err, address) => {
      if (err) {
        return res.json({ error: 'Invalid URL' });
      }
      // Proceed with creating and storing the short URL

      // Check if url already has a short version
      let url = await Url.findOne({originalUrl: original});
      
      // If not, creates a new document for this URL
      if (!url) {
        const shortUrl = Math.random().toString(36).substring(2, 8);

        url = new Url({
          originalUrl: original,
          shortUrl: shortUrl
        });
        await url.save();
      }

      res.json({ originalUrl: url.originalUrl , shortUrl: url.shortUrl });
    });
  } catch (error) {
    res.json({error: 'Invalid URL'});
  }
});

app.get('/api/shorturl/:shortUrl', async function(req, res) {
  const shortUrl = req.params.shortUrl;
  const url = await Url.findOne({ shortUrl: shortUrl});

  if (!url) {
    res.redirect(url.originalUrl);
  } else {
    res.json({error: 'No short URL found for the given input'});
  }
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
