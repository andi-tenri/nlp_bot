const { Controller, Response } = require("pepesan");
const { processMessage } = require("../../nlp");
const fs = require("fs");
const path = require("path");
const db = require("../../models/index");
const { formatRupiah } = require("../../utils/formatter");

class MainController extends Controller {

    async getCatalog(fileName) {
        try {
            const file = fs.readFileSync(path.resolve(__basedir, `images/${fileName}.pdf`));
            return Response.document.fromBuffer(file);
        } catch (e) {
            return "Gambar tidak ditemukan";
        }
    }

    async getProduct(fileName) {
        try {
            const file = fs.readFileSync(path.resolve(__basedir, `images/${fileName}.jpeg`));
            return Response.image.fromBuffer(file);
        } catch (e) {
            return "Gambar tidak ditemukan";
        }
    }

    async getAdditionalMessage(intent) {
        if (intent === "informasi katalog") {
            return await this.getCatalog("ADHITYA CARD HARGA BLANGKO");
        }
        return "";
    }

    async getAdditionalMessage1(intent) {
        if (intent === "pricelist") {
            return await this.getProduct("Daftar harga");
        }
        return "";
    }

    async getProductOnly(productName) {
        console.log(`Mencari produk dengan nama: ${productName}`);
        await this.reply('Sebentar ya, kami cari dulu produknya.');
        const product = await db.Product.findOne({
            where: {
                name: productName.toUpperCase() 
            }
        });

        if (!product) {
            return `Produk ${productName} tidak ditemukan`;
        }
        const response = `Berikut detail produk ${productName}\n\nHarga: ${formatRupiah(product.price)}\nStok: ${product.stock}\nDeskripsi:\n${product.description}`;
        const catalog = await this.getProduct(productName);
        if (catalog) {
            await this.reply(catalog);
        }

        return response;
    }

    async getProductDetail(request) {
        let productId = request.text
        productId = productId.toUpperCase()
        const product = await db.Product.findOne({
            where: {
                name: productId
            }
        })
        if (!product) {
            return `Produk ${productId} tidak ditemukan`
        }
        const response = `Berikut kami kasih info produk lengkapnya ya kak... \n\nKode Produk: ${productId}\nHarga: ${formatRupiah (product.price)}\nStok: ${product.stock}\nDeskripsi:\n${product.description}`;
        const catalog = await this.getProduct(productId);

        if (catalog) {
            await this.reply(catalog);
        }

        return response;
    }

    async index(request) {
        const text = request.text;
        const response = await processMessage(text);
        console.log('NLP Response:', response);
        const additionalMessage = await this.getAdditionalMessage(response.intent);
        if (additionalMessage) {
            await this.reply(additionalMessage);
        }
        const additionalMessage1 = await this.getAdditionalMessage1(response.intent);
        if (additionalMessage1) {
            await this.reply(additionalMessage1);
        }
    
        if (!response.answer) {
            await db.Unanswered.create({
                utterance: text
            });
            await this.reply('Mohon maaf kak, sepertinya saya kesulitan memahami pertanyaan Anda, silahkan masukan kembali pertanyaan');
            await this.reply('ketik *MENU* untuk memilih menu yang tersedia pada sistem');
            return;
        }

        const productEntity = response.entities.find(entity => entity.entity === 'produk');
        if (response.intent === 'detail' && productEntity) {
            const productName = String(productEntity.option).toLowerCase();
            const productResponse = await this.getProductOnly(productName);
            await this.reply(productResponse);
            return; 
        }
    
        await this.reply(response.answer);
    }    
}

module.exports = MainController;