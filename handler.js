const chromium = require('chrome-aws-lambda');
const googleSheets = require('./sheets')
const scraper = require('./scraper');
const { delay } = require('./utils');
const AWS = require('aws-sdk');

const lambda = new AWS.Lambda({
  region: 'us-east-1',
});

module.exports.startScrapes = async (event) => {
  const sheets = await googleSheets();

  const books = await sheets.getAllBooks();

  books.forEach(async book => {
    const params = {
      FunctionName: 'scholastic-scraper-dev-get_guided_reading_level',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(book)
    };

    await delay(1000);

    console.log('calling lambda with params', JSON.stringify(params, null, 2));

    return lambda.invoke(params, (error, data) => {
      if (error) {
        console.error(JSON.stringify(error))
        return new Error(`Error printing messages: ${JSON.stringify(error)}`);
      } else if (data) {
        console.log(data);
      }
    })
  });
}

module.exports.getGuidedReadingLevel = async (book) => {
  const sheets = await googleSheets();

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  const bookWithLevel = await scraper.getGuidedReadingLevel(book, page);

  await sheets.writeLevelToSheet(bookWithLevel);
 
  return {
    statusCode: 200,
    body: JSON.stringify({
      bookWithLevel,
    }),
  };
};
