
const $ = require('cheerio');
const SCHOLASTIC_BOOK_WIZARD_BASE_URL = 'https://www.scholastic.com/teachers/bookwizard/?search=1&filters=&prefilter=books&text=';

const createSearchUrl = title => {
  return `${SCHOLASTIC_BOOK_WIZARD_BASE_URL}${encodeURIComponent(title)}`;
}

// const getMultipleLevels = async (books) => {
//   const browser = await puppeteer.launch({
//     args: [  
//     "--no-sandbox",
//     "--single-process",
//     "--no-zygote"
//   ]
//   });

//   const page = await browser.newPage();

//   const levels = [];

//   for (const book of books) {
//     const level = await getGuidedReadingLevel(book, page);
//     levels.push(level);
//   }

//   await browser.close();

//   return levels.filter(level => level !== null);
// }

const getGuidedReadingLevel = async (book, page) => {
  console.log('Navigating to ' + createSearchUrl(book.title));

  await page.goto(createSearchUrl(book.title));

  console.log('Getting page content');

  const content = await page.content();



  console.log('Parsing contents')


  const results = $('.results-non-mobile', content)

  const containers = results.find('card-container');

  console.log(`Found ${containers.length} results`);

  if (containers.length === 0) return {
    ...book,
    level: null,
  };

  const data = containers[0].attribs


  if (data.level === "") {
    console.log('First result has no GR level, returning null');
    return {
      ...book,
      level: null,
    };
  }


  console.log(`GR level for ${book.title} is ${data.level}`);

  return {
    ...book,
    level: data.level,
  }
}

module.exports = {
  getGuidedReadingLevel,
}