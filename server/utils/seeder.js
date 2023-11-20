const path = require("path");
const { parseCsv } = require("./csv");

const parseSeederCsv = (fileName) => {
    const filePath = path.resolve(__dirname, `../seeders/csvs/${fileName}.csv`);

    return parseCsv(filePath);
}

const seedFromCsv = async (queryInterface, tableName) => {
    const rows = await parseSeederCsv(tableName.toLowerCase());

    await queryInterface.bulkInsert(tableName, rows, {
        
    });
}

module.exports = {
    parseSeederCsv,
    seedFromCsv
}
