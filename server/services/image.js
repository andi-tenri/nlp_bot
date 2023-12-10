const fs = require("fs");
const path = require("path");

const uploadImage = (tempPath, name) => {

    const imageDir = path.resolve(__basedir, "images");

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    const filePath = path.resolve(imageDir, name + ".jpeg");

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const buffer = fs.readFileSync(tempPath);

    fs.writeFileSync(filePath, buffer);

    fs.unlinkSync(tempPath);
}

const deleteImage = (name) => {
    const imageDir = path.resolve(__basedir, "images");

    if (fs.existsSync(path.resolve(imageDir, name + ".jpeg"))) {
        fs.unlinkSync(path.resolve(imageDir, name + ".jpeg"));
    }

    return true;
}

module.exports = {
    uploadImage,
    deleteImage
}