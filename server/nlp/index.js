// nlp.js
const { NlpManager } = require('node-nlp');
const Sastrawi = require('sastrawijs');
const fs = require('fs');
const database = require('./database');

const manager = new NlpManager({ languages: ['id'], autoSave: true, threshold: 0.3 });
const stemmer = new Sastrawi.Stemmer();
const modelPath = 'model.nlp';

// Normalisasi, Case Folding, Tokenisasi, dan Stemming
function processUserInput(text) {
    const normalizedText = text.replace(/[?.,/#!$%^&*;:{}=\-_`~()]/g, '');
    const caseFoldedText = normalizedText.toLowerCase();
    const words = caseFoldedText.split(/\s+/);
    const stemmedWords = words.map(word => stemmer.stem(word));
    const processedText = stemmedWords.join(' ');
    return processedText;
}

// Fetch data from the database for training
async function fetchDataFromDatabase() {
    try {
        const intentsData = await database.getIntentsData();
        if (intentsData && intentsData.length > 0) {
            intentsData.forEach((item) => {
                const { intent, utterance, answer } = item;
                manager.addDocument('id', processUserInput(utterance), intent);
                manager.addAnswer('id', intent, answer);
            });
            await manager.train();
            console.log('Pelatihan selesai. Menyimpan model...');
            await manager.save(modelPath);
        } else {
            console.error('Tidak ada data yang dikembalikan dari database atau data kosong.');
        }
    } catch (error) {
        console.error('Error mengambil data dari database:', error);
    }
}
fetchDataFromDatabase();

// Ekspor fungsi processMessage
function processMessage(userMessage) {
    const processedQuestion = processUserInput(userMessage);
    return manager.process('id', processedQuestion)
        .then(response => {
            return response.answer;
        })
        .catch(error => {
            console.error(error);
            return "Maaf, ada kesalahan dalam memproses permintaan Anda.";
        });
}

module.exports = {
    processMessage,
    modelPath,
};

