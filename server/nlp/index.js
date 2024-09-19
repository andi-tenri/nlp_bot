const { NlpManager } = require('node-nlp');
const Sastrawi = require('sastrawijs');
const fs = require('fs');
const path = require('path');
const stopwords = require('stopwords-id');
const db = require("../models");

let manager = new NlpManager({ languages: ['id'], autoSave: true, forceNER: true, threshold: 0.3, useNeural: true});
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
    const stemmedWords = words.map(word => stemmer.stem(word));
    const processedText = stemmedWords.join(' ');
    return processedText;
}

async function addNerEntities() {
    const products = await db.Product.findAll({
        attributes: ['name', 'stock', 'price'],
    });

    products.forEach(product => {
        const productName = product.name.toLowerCase();
        const productStock = product.stock;
        const productPrice = product.price;

        // Menambahkan dokumen dengan entitas stok, harga, ketersediaan, dan waktu ready
        manager.addDocument('id', `berapa stok produk ${productName}`, 'stok');
        manager.addDocument('id', `stok ${productName}`, 'stok');
        manager.addDocument('id', `berapa harga produk ${productName}`, 'harga');
        manager.addDocument('id', `harga ${productName}`, 'harga');
        manager.addDocument('id', `apakah produk ${productName} ready`, 'ketersediaan');
        manager.addDocument('id', `ada ${productName}`, 'ketersediaan');
        manager.addDocument('id', `kapan ready kembali`, 'waktu_ada');
        manager.addDocument('id', `ready ji lagi nanti`, 'waktu_ada');
        manager.addDocument('id', `kapan ready lagi`, 'waktu_ada');
        manager.addDocument('id', `detail produk ${productName}`, 'detail');
        manager.addDocument('id', `lihat ${productName}`, 'detail');
        manager.addDocument('id', `kirimkan gambar ${productName}`, 'detail');

        // Menambahkan entitas produk
        manager.addNamedEntityText('produk', productName, ['id'], [productName]);

        // Menambahkan jawaban untuk setiap entitas
        manager.addAnswer('id', 'stok', `Stok produk ${productName} adalah ${productStock}`);
        manager.addAnswer('id', 'harga', `Harga produk ${productName} adalah ${productPrice}`);
        manager.addAnswer('id', 'ketersediaan', productStock > 0 ? `Produk ${productName} ready kak, silahkan di order` : `Belum ready kak`);
        manager.addAnswer('id', 'waktu_ada', `Belum tau kak, nanti kami kabari jika sudah ready kembali.`);
        manager.addAnswer('id', 'detail', `berikut detail`);
    });
}

async function fetchDataFromDatabase() {
    try {
        const intentsData = await db.Dataset.findAll();
        if (fs.existsSync(modelPath)) {
            fs.unlinkSync(modelPath);
        }
        manager = new NlpManager({ languages: ['id'], autoSave: true, forceNER: true, threshold: 0.3, useNeural: true });
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

    // Mengambil entitas produk dari respons
    const productEntities = response.entities.filter(entity => entity.entity === 'produk');

    // Menyaring respons berdasarkan intent
    if (response.intent === 'stok') {
        let stockAnswers = [];
        for (const entity of productEntities) {
            const productName = entity.option;
            const product = await db.Product.findOne({ where: { name: productName } });

            if (product) {
                stockAnswers.push(`Stok produk ${productName} adalah ${product.stock}.`);
            } else {
                stockAnswers.push(`Produk ${productName} tidak ditemukan.`);
            }
        }
        response.answer = stockAnswers.join('\n');
    } else if (response.intent === 'harga') {
        let priceAnswers = [];
        for (const entity of productEntities) {
            const productName = entity.option;
            const product = await db.Product.findOne({ where: { name: productName } });

            if (product) {
                priceAnswers.push(`Harga produk ${productName} adalah Rp${product.price},`);
            } else {
                priceAnswers.push(`Produk ${productName} tidak ditemukan.`);
            }
        }
        response.answer = priceAnswers.join('\n');
    } else if (response.intent === 'ketersediaan') {
        let availabilityAnswers = [];
        for (const entity of productEntities) {
            const productName = entity.option;
            const product = await db.Product.findOne({ where: { name: productName } });

            if (product) {
                availabilityAnswers.push(product.stock > 0 ? `Produk ${productName} ready kak, silahkan di order.` : `Produk ${productName} Belum ready kak.`);
            } else {
                availabilityAnswers.push(`Produk ${productName} tidak ditemukan.`);
            }
        }
        response.answer = availabilityAnswers.join('\n');
    } else if (response.intent === 'waktu_ready') {
        response.answer = `Belum tau kak, nanti kami kabari jika sudah ready kembali.`;
    }

    return response;
}

module.exports = {
    fetchDataFromDatabase,
    processMessage,
    modelPath,
    manager
};
