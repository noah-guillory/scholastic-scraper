const express = require('express');
const puppeteer = require('puppeteer');
const { getGuidedReadingLevel, getMultipleLevels } = require('./scraper');

const app = express();
app.use(express.json());

app.post('/search/guided-reading', async (req, res) => {
  const { title } = req.body;

  console.log(`Retrieving GR level for ${title}`)

  const level = await getGuidedReadingLevel(title);

  res.json({
    title,
    level,
  })
})

app.post('/search/guided-reading-batch', async (req, res) => {
  const { titles } = req.body;

  console.log('Retrieving GR levels for ' + titles.length  + ' titles');

  const levels = await getMultipleLevels(titles);

  res.json(levels);
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("listening on port " + port);
});


