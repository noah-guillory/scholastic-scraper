const { GoogleSpreadsheet } = require("google-spreadsheet");


const getAllBooks = async () => {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: JSON.parse(process.env.GOOGLE_PRIVATE_KEY),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByTitle[process.env.SHEET_NAME];

  const bookRows = await sheet.getRows();

  return bookRows
  .filter(row => row.Level !== '-' && row.Level === undefined)
  .map(row => ({
    title: row.Title,
    rowNumber: row.rowNumber,
  }));

};

const delay = interval => new Promise(resolve => setTimeout(resolve, interval));


const writeLevelsToSheet = async (books) => {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: JSON.parse(process.env.GOOGLE_PRIVATE_KEY),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByTitle[process.env.SHEET_NAME];

  const bookRows = await sheet.getRows();

  console.log('Writing ' + books.length + ' levels');


  for (const book of books) {
    const matchingRow = bookRows.find(sheetRow => book.rowNumber === sheetRow.rowNumber);
    if (matchingRow) {
      console.log('Found matching for ' + book.title);
      matchingRow.Level = book.level ? book.level : '-',
      await matchingRow.save();
    }
    await delay(1000);
  }

}

module.exports = {
  getAllBooks,
  writeLevelsToSheet,
};
