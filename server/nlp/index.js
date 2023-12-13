// nlp.js
const { NlpManager } = require('node-nlp');
const Sastrawi = require('sastrawijs');
const fs = require('fs');
const db = require("../models");
const path = require("path");

let manager = new NlpManager({ languages: ['id'], autoSave: true, threshold: 0.3 });
const stemmer = new Sastrawi.Stemmer();
const modelPath = path.resolve(__basedir, "model.nlp")

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
        const intentsData = await db.Dataset.findAll();
        fs.unlinkSync(modelPath);
        manager = new NlpManager({ languages: ['id'], autoSave: true, threshold: 0.3 });
        if (intentsData && intentsData.length > 0) {
            intentsData.forEach((item) => {
                const { intent, utterance, answer } = item;
                manager.addDocument('id', processUserInput(utterance), intent);
                manager.addAnswer('id', intent, answer);
            });
            console.log('Training model ...');
            await manager.train();
            console.log("Saving model...");
            await manager.save(modelPath);
            console.log('Model saved to:', modelPath);
        } else {
            console.error('Tidak ada data yang dikembalikan dari database atau data kosong.');
        }
    } catch (error) {
        console.error('Error mengambil data dari database:', error);
    }
}

// Ekspor fungsi processMessage
function processMessage(userMessage) {
    const processedQuestion = processUserInput(userMessage);
    return manager.process('id', processedQuestion)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
            return "Maaf, ada kesalahan dalam memproses permintaan Anda.";
        });
}

module.exports = {
    fetchDataFromDatabase,
    processMessage,
    modelPath,
    manager
};

