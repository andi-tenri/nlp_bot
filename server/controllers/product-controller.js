const db = require("../models");
const { uploadImage, deleteImage } = require("../services/image");
const { pickProperties } = require("../utils/collection");

exports.getAll = async (req, res) => {
    const products = await db.Product.findAll();

    return res.send({ success: true, data: products });
}

exports.insert = async (req, res) => {
    uploadImage(req.file.path, req.body.name);

    const data = pickProperties(req.body, ["name", "price", "stock", "description"]);

    data.image = data.name + ".jpeg";

    await db.Product.create(data);

    return res.send({ success: true });
}

exports.update = async (req, res) => {
    const id = req.params.id;

    if (req.file) {
        uploadImage(req.file.path, req.body.name);
    }

    const data = pickProperties(req.body, ["name", "price", "stock", "description"]);

    data.image = data.name + ".jpeg";

    await db.Product.update(data, {
        where: {
            id
        }
    });

    return res.send({ success: true });
}

exports.delete = async (req, res) => {
    const id = req.params.id;

    const product = await db.Product.findOne({
        where: {
            id
        }
    });

    if (!product) {
        return res.status(404).send({ success: false, message: "Product not found" });
    }

    await db.Product.destroy({
        where: {
            id
        }
    });

    deleteImage(product.name);

    return res.send({ success: true });
}