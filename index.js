const express = require('express');
const puppeteer = require('puppeteer');
const { getGuidedReadingLevel } = require('./scraper');

const app = express();
app.use(express.json());

app.post('/search/guided-reading', async (req, res) => {
  const { title } = req.body;

  console.log(`Retrieving GR level for ${title}`)

  const level = await getGuidedReadingLevel(title);

  res.json({
    level,
  })
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("listening on port " + port);
});


