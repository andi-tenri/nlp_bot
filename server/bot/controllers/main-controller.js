const { Controller, Response } = require("pepesan");
const { processMessage } = require("../../nlp");
const fs = require("fs");
const path = require("path");

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

        return response.answer;

    }

    async getProductDetail(request) {
        const productId = request.text;

        const response = `Berikut detail produk ${productId}`;

        const catalog = await this.getCatalog(productId);

        if (catalog) {
            await this.reply(catalog);
        }

        return response;
    }

}

module.exports = MainControlller
