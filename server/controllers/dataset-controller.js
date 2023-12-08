const { fetchDataFromDatabase } = require("../nlp");
const db = require("../models");

exports.getAll = async (req, res) => {
    try {
        const { intent, utterance } = req.query;
        const { limit, offset } = req.query;

        const where = {};
        if (intent) {
            where.intent = intent;
        }
        if (utterance) {
            where.utterance = utterance;
        }

        const dataset = await db.Dataset.findAll({
            where,
            limit,
            offset,
        });

        res.send({
            success: true,
            data: dataset,
            message: "Dataset retrieved successfully",
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }

}

exports.create = async (req, res) => {
    try {
        const { intent, utterance, answer } = req.body;

        const dataset = await db.Dataset.create({
            intent,
            utterance,
            answer
        });

        res.send({
            success: true,
            data: dataset,
            message: "Dataset created successfully",
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { intent, utterance, answer } = req.body;

        const dataset = await db.Dataset.update({
            intent,
            utterance,
            answer
        }, {
            where: {
                id
            }
        });

        res.send({
            success: true,
            data: dataset,
            message: "Dataset updated successfully",
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const dataset = await db.Dataset.destroy({
            where: {
                id
            }
        });

        res.send({
            success: true,
            data: dataset,
            message: "Dataset deleted successfully",
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }

}

exports.updateIntent = async (req, res) => {
    try {
        const { oldIntent, newIntent } = req.body;

        const dataset = await db.Dataset.update({
            intent: newIntent
        }, {
            where: {
                intent: oldIntent
            }
        });

        res.send({
            success: true,
            data: dataset,
            message: "Dataset updated successfully",
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteIntent = async (req, res) => {
    try {
        const { intent } = req.body;

        const dataset = await db.Dataset.destroy({
            where: {
                intent
            }
        });

        res.send({
            success: true,
            data: dataset,
            message: "Dataset deleted successfully",
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }

}

exports.refreshModel = async (req, res) => {
    try {
        await fetchDataFromDatabase();

        res.send({
            success: true,
            message: "Model refreshed successfully",
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }

}