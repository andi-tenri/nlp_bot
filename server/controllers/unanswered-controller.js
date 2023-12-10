const db = require("../models");

exports.getAll = async (req, res) => {
    const dataset = await db.Unanswered.findAll();

    res.send({
        success: true,
        data: dataset
    });
}

exports.delete = async (req, res) => {
    const id = req.params.id;

    await db.Unanswered.destroy({
        where: {
            id
        }
    });

    return res.send({
        success: true
    });

}