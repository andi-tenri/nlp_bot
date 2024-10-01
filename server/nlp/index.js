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
        manager.addDocument('id', `apakah stok ${productName} tersedia`, 'stok');
        manager.addDocument('id', `cek stok ${productName}`, 'stok');
        manager.addDocument('id', `produk ${productName} masih ada stoknya?`, 'stok');
        manager.addDocument('id', `berapa sisa stok ${productName}`, 'stok');
        manager.addDocument('id', `berapa banyak stok tersisa untuk ${productName}?`, 'stok');
        manager.addDocument('id', `berapa ketersediaan ${productName}?`, 'stok');
        manager.addDocument('id', `ada stok ${productName} berapa?`, 'stok');
        manager.addDocument('id', `stok produk ${productName} habis atau masih ada?`, 'stok'); // Tambahan
        manager.addDocument('id', `berapa jumlah stok ${productName} sekarang?`, 'stok'); // Tambahan
        manager.addDocument('id', `apakah stok ${productName} cukup banyak?`, 'stok'); // Tambahan

        
        // Harga
        manager.addDocument('id', `berapa harga produk ${productName}`, 'harga');
        manager.addDocument('id', `harga ${productName}`, 'harga');
        manager.addDocument('id', `produk ${productName} berapa harganya?`, 'harga');
        manager.addDocument('id', `berapa sih harga ${productName}`, 'harga');
        manager.addDocument('id', `apakah harga ${productName} sudah termasuk pajak?`, 'harga');
        manager.addDocument('id', `berapa harga terbaru ${productName}`, 'harga');
        manager.addDocument('id', `berapa harga asli ${productName}?`, 'harga');
        manager.addDocument('id', `produk ${productName} dijual dengan harga berapa?`, 'harga');
        manager.addDocument('id', `berapa biaya untuk membeli ${productName}?`, 'harga'); // Tambahan
        manager.addDocument('id', `berapa harga jual dari ${productName}?`, 'harga'); // Tambahan
        manager.addDocument('id', `berapa harga pasaran ${productName}?`, 'harga'); // Tambahan

        // Ketersediaan
        manager.addDocument('id', `apakah produk ${productName} ready`, 'ketersediaan');
        manager.addDocument('id', `ada ${productName}`, 'ketersediaan');
        manager.addDocument('id', `produk ${productName} tersedia tidak?`, 'ketersediaan');
        manager.addDocument('id', `produk ${productName} masih ready?`, 'ketersediaan');
        manager.addDocument('id', `cek apakah ${productName} ready`, 'ketersediaan');
        manager.addDocument('id', `cek ketersediaan ${productName}`, 'ketersediaan');
        manager.addDocument('id', `ready stok ${productName}?`, 'ketersediaan');
        manager.addDocument('id', `apakah ${productName} tersedia sekarang?`, 'ketersediaan');
        manager.addDocument('id', `produk ${productName} masih tersedia?`, 'ketersediaan');
        manager.addDocument('id', `produk ${productName} ada di toko?`, 'ketersediaan'); // Tambahan
        manager.addDocument('id', `apakah saya bisa beli ${productName} sekarang?`, 'ketersediaan'); // Tambahan
        manager.addDocument('id', `produk ${productName} tersedia di gudang?`, 'ketersediaan'); // Tambahan

        // Waktu Ketersediaan
        manager.addDocument('id', `kapan ready kembali`, 'waktu_ada');
        manager.addDocument('id', `ready ji lagi nanti`, 'waktu_ada');
        manager.addDocument('id', `kapan ready lagi`, 'waktu_ada');
        manager.addDocument('id', `produk ${productName} kapan ready lagi?`, 'waktu_ada');
        manager.addDocument('id', `kapan ${productName} restock?`, 'waktu_ada');
        manager.addDocument('id', `produk ${productName} kapan ada lagi?`, 'waktu_ada');
        manager.addDocument('id', `produk ${productName} kapan tersedia lagi?`, 'waktu_ada');
        manager.addDocument('id', `berapa lama lagi ${productName} ready?`, 'waktu_ada');
        manager.addDocument('id', `kapan ${productName} bisa dibeli lagi?`, 'waktu_ada');

        // Detail Produk
        manager.addDocument('id', `detail produk ${productName}`, 'detail');
        manager.addDocument('id', `lihat ${productName}`, 'detail');
        manager.addDocument('id', `kirimkan gambar ${productName}`, 'detail');
        manager.addDocument('id', `berikan informasi ${productName}`, 'detail');
        manager.addDocument('id', `bisa kirimkan detail tentang ${productName}?`, 'detail');
        manager.addDocument('id', `info lebih lanjut tentang ${productName}`, 'detail');
        manager.addDocument('id', `apa spesifikasi dari ${productName}?`, 'detail');
        manager.addDocument('id', `saya ingin tahu lebih banyak tentang ${productName}`, 'detail');
        manager.addDocument('id', `bagaimana deskripsi dari produk ${productName}?`, 'detail');


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
