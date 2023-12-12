const { Controller, Response } = require("pepesan");
const { processMessage } = require("../../nlp");
const fs = require("fs");
const path = require("path");
const db = require("../../models/index");
const { formatRupiah } = require("../../utils/formatter")

class MainControlller extends Controller {

    async getCatalog(fileName) {
        try {
            const file = fs.readFileSync(path.resolve(__basedir, `images/${fileName}.jpeg`));
            return Response.image.fromBuffer(file);
        } catch (e) {
            return "Gambar tidak ditemukan";
        }
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
            await db.Unanswered.create({
                utterance: text
            })
            return "Mohon maaf, sepertinya saya kesulitan memahami pertanyaan Anda.\nCoba sampaikan lagi pertanyaan Anda.\n\nJika Anda memerlukan bantuan segera atau pertanyaan yang lebih kompleks, silakan hubungi Admin kami di:\n\n📞 081258052309\n\nTerima kasih atas pengertian dan kesabaran Anda."
        }

        return response.answer;

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

        const response = `Berikut detail produk ${productId}\nHarga: ${formatRupiah(product.price)}\nStok: ${product.stock}\nDeskripsi:\n${product.description}`;

        const catalog = await this.getCatalog(productId);

        if (catalog) {
            await this.reply(catalog);
        }

        return response;
    }

}

module.exports = MainControlller
