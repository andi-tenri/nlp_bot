const { NlpManager } = require('node-nlp');
const Sastrawi = require('sastrawijs');
const fs = require('fs');
const db = require("../models");
const path = require("path");
const stopwords = require('stopwords-id');

let manager = new NlpManager({ languages: ['id'], autoSave: true, forceNER: true,  threshold: 0.3 });
const stemmer = new Sastrawi.Stemmer();
const modelPath = path.resolve(__basedir, "model.nlp");
const slangwords = require('./word.json'); 

function replaceSlangwords(text) {
    const words = text.split(/\s+/);
    const replacedWords = words.map(word => {
        const normalizedWord = word.toLowerCase();
        if (slangwords[normalizedWord]) {
            return slangwords[normalizedWord];
        }
        return word;
    });
    return replacedWords.join(' ');
}

function processUserInput(text) {
    text = replaceSlangwords(text);
    const normalizedText = text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    const caseFoldedText = normalizedText.toLowerCase();
    const words = caseFoldedText.split(/\s+/);
    const filteredWords = words.filter(word => !stopwords.includes(word));
    const stemmedWords = filteredWords.map(word => stemmer.stem(word));
    const processedText = stemmedWords.join(' ');
    return processedText;
}

async function addNerEntities() {
    const products = await db.Product.findAll({
        attributes: ['name', 'stock', 'price'], // Tambahkan atribut 'price'
    });

    products.forEach(product => {
        const productName = product.name.toLowerCase();
        const productStock = product.stock;
        const productPrice = product.price;
        manager.addNamedEntityText(
            'produk',
            productName,
            ['id'],
            [productName]
        );
        manager.addNamedEntityText(
            'stok',
            productStock.toString(),
            ['id'],
            [`${productName} stok`]
        );
        manager.addNamedEntityText(
            'harga',
            productPrice.toString(),
            ['id'],
            [`${productName} harga`]
        );
    });
}

async function fetchDataFromDatabase() {
    try {
        const intentsData = await db.Dataset.findAll();
        fs.unlinkSync(modelPath);
        manager = new NlpManager({ languages: ['id'], autoSave: true, forceNER: true,  threshold: 0.3 });
        await addNerEntities();
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

async function processMessage(userMessage) {
    const processedQuestion = processUserInput(userMessage);
    const response = await manager.process('id', processedQuestion);
    console.log('Entities:', response.entities);
    if (response.entities && response.entities.length > 0) {
        const productEntities = response.entities.filter(entity => entity.entity === 'produk');
        if (productEntities.length > 0) {
            const productName = productEntities[0].option;
            const product = await db.Product.findOne({ where: { name: productName } });
            if (product) {
                response.answer += ` ${productName} ${product.stock}.`;
                response.answer += ` ${productName} ${product.price}.`;
            } else {
                response.answer += ` Produk ${productName} tidak ditemukan.`; 
            }
        }
    }
    return response;
}

module.exports = {
    fetchDataFromDatabase,
    processMessage,
    modelPath,
    manager
};
