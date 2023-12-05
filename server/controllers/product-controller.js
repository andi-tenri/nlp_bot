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
                name: _,
                cover: `/images/${_}`,
            }
        })
        
    return res.send(products);

}