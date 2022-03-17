const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// mongodb://localhost/urlShortener
// $Env:DB_CONN_STRING = "mongodb://localhost/urlShortener"

mongoose.connect(process.env.DB_CONN_STRING, {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'))

app.get('/api/urls', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ shortUrls: shortUrls }));
})

app.post('/api/urls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})


app.listen(process.env.PORT || 5000);