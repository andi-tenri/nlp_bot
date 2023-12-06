const fs = require("fs");
const path = require("path");
const db = require("../models");

exports.getAll = async (req, res) => {
    // read list of products in folder
    const products = fs
        .readdirSync(path.resolve(__basedir, "images"))
        .filter((file) => file.endsWith(".jpeg") && file.startsWith("AD"))
        .map(_ => {
            return {
                name: _.split(".")[0],
                cover: `/images/${_}`,
            }
        })

    return res.send(products);

}

exports.insert = async (req, res) => {
    const { body } = req;

    const buffer = fs.readFileSync(req.file.path);

    fs.writeFileSync(path.resolve(__basedir, "images", body.name + ".jpeg"), buffer);

    fs.unlinkSync(req.file.path);

    return res.send({ success: true });
}

exports.update = async (req, res) => {
    const id = req.params.id;

    const imageDir = path.resolve(__basedir, "images");

    if (fs.existsSync(path.resolve(imageDir, id + ".jpeg"))) {
        fs.unlinkSync(path.resolve(imageDir, id + ".jpeg"));
    }

    const { name } = req.body;

    const buffer = fs.readFileSync(req.file.path);

    fs.writeFileSync(path.resolve(__basedir, "images", name + ".jpeg"), buffer);

    fs.unlinkSync(req.file.path);

    return res.send({ success: true });
}

exports.delete = async (req, res) => {
    const id = req.params.id;

    const imageDir = path.resolve(__basedir, "images");

    if (fs.existsSync(path.resolve(imageDir, id + ".jpeg"))) {
        fs.unlinkSync(path.resolve(imageDir, id + ".jpeg"));
    }

    return res.send({ success: true });
}