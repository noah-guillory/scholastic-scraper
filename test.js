const scraper = require('./scraper');

(async() => {
  console.log(await scraper.getGuidedReadingLevel(`Let's Drive, Henry Ford!`));
})();