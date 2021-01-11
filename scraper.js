
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const SCHOLASTIC_BOOK_WIZARD_BASE_URL = 'https://www.scholastic.com/teachers/bookwizard/?search=1&filters=&prefilter=books&text=';

const createSearchUrl = title => {
  return `${SCHOLASTIC_BOOK_WIZARD_BASE_URL}${encodeURIComponent(title)}`;
}

const getGuidedReadingLevel = async (title) => {
  const browser = await puppeteer.launch({
    args: [  "--incognito",
    "--no-sandbox",
    "--single-process",
    "--no-zygote"]
  });

  const page = await browser.newPage();

  await page.goto(createSearchUrl(title));

  const content = await page.content();




  const results = $('.results-non-mobile', content)

  const containers = results.find('card-container');

  console.log(`Found ${containers.length} results`);

  if (containers.length === 0) return null;

  const data = containers[0].attribs

  if (data.level === "") {
    console.log('First result has no GR level, returning null');
    return null;
  }

  browser.close();

  console.log(`GR level for ${title} is ${data.level}`);

  return data.level;
}

module.exports = {
  getGuidedReadingLevel,
}