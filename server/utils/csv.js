const Papa = require('papaparse');
const parseCsv = (path) => {
    return new Promise((resolve, reject) => {

        const csv = require('fs').readFileSync(path, 'utf8');

        if (!csv) {
            reject('File not found');
            return;
        }

        if (csv.length === 0) {
            reject('File is empty');
            return;
        }

        Papa.parse(csv, {
            header: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}
module.exports = {
    parseCsv,
}