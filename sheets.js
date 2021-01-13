const { GoogleSpreadsheet } = require("google-spreadsheet");

const { delay } = require('./utils');

const init = async () => {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: JSON.parse(process.env.GOOGLE_PRIVATE_KEY),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByTitle[process.env.SHEET_NAME];



  const getAllBooks = async () => {
    const bookRows = await sheet.getRows();

    return bookRows
    .filter(row => row.Level !== '-' && row.Level === undefined)
    .map(row => ({
      title: row.Title,
      rowNumber: row.rowNumber,
    }));
  }

  const writeLevelToSheet = async book => {
    const { rowNumber, level } = book;
    
    const levelCell = await sheet.getCell(rowNumber - 1, 5);
    levelCell.value = level ? level : '-';
    await levelCell.save();
  }

  const writeLevelsToSheet = async books => {
    console.log('Writing ' + books.length + ' levels');
  
  
    for (const book of books) {
      await writeLevelToSheet(book);
      await delay(1000);
    }
  }

  const getTitle = async rowNumber => {
    const titleCell = await sheet.getCell(rowNumber - 1, 0);
    return titleCell.value;
  }

  return { 
    getAllBooks,
    writeLevelsToSheet,
    writeLevelToSheet,
    getTitle,
  }
}





module.exports = init;
