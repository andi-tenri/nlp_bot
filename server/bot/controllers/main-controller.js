const { Controller, Response } = require("pepesan");
const { processMessage } = require("../../nlp");
const fs = require("fs");
const path = require("path");
const db = require("../../models/index");

class MainControlller extends Controller {

    async getCatalog(fileName) {
        const file = fs.readFileSync(path.resolve(__basedir, `images/${fileName}.jpeg`));
        return Response.image.fromBuffer(file);
    }

    async getAdditionalMessage(intent) {
        if (intent === "informasi katalog") {
            return await this.getCatalog("Daftar Harga");
        }

        return "";
    }

    async index(request) {
        const text = request.text;

        const response = await processMessage(text);

        const additionalMessage = await this.getAdditionalMessage(response.intent);

        if (additionalMessage) {
            await this.reply(additionalMessage)
        }

        if (!response.answer) {
            await db.Dataset.create({
                intent: "_",
                answer: "_",
                utterance: text
            })
            return "Maaf, sepertinya saya kesulitan memahami pertanyaan Anda. Mohon coba lagi sampaikan pertanyaan Anda dengan lebih jelas. Jika ada yang bisa saya bantu, beri tahu saya. Terima kasih."
        }

        return response.answer;

    }

    async getProductDetail(request) {
        let productId = request.text

        productId = productId.toUpperCase()

        const response = `Berikut detail produk ${productId}`;

        const catalog = await this.getCatalog(productId);

        if (catalog) {
            await this.reply(catalog);
        }

        return response;
    }

}

module.exports = MainControlller
