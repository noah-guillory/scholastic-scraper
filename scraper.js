
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const SCHOLASTIC_BOOK_WIZARD_BASE_URL = 'https://www.scholastic.com/teachers/bookwizard/?search=1&filters=&prefilter=books&text=';

const createSearchUrl = title => {
  return `${SCHOLASTIC_BOOK_WIZARD_BASE_URL}${encodeURIComponent(title)}`;
}

const getMultipleLevels = async (titles) => {
  const browser = await puppeteer.launch({
    args: [  
    "--no-sandbox",
    "--single-process",
    "--no-zygote"
  ]
  });

  const page = await browser.newPage();

  const levels = titles.map(title => {
    getGuidedReadingLevel(title, page)
  })

  await browser.close();

  return levels;
}

const getGuidedReadingLevel = async (title, page) => {
  console.log('Navigating to ' + createSearchUrl(title));

  await page.goto(createSearchUrl(title));

  console.log('Getting page content');

  const content = await page.content();



  console.log('Parsing contents')


  const results = $('.results-non-mobile', content)

  const containers = results.find('card-container');

  console.log(`Found ${containers.length} results`);

  if (containers.length === 0) return null;

  const data = containers[0].attribs


  if (data.level === "") {
    console.log('First result has no GR level, returning null');
    return {
      title,
      level: null,
    };
  }


  console.log(`GR level for ${title} is ${data.level}`);

  return {
    title,
    level: data.level,
  }
}

module.exports = {
  getGuidedReadingLevel,
  getMultipleLevels,
}