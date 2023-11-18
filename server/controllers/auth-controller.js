const db = require("../models");
const bcrypt = require("bcryptjs");
const ResponseError = require("../errors/response-error");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");
const { signToken, isTokenValid } = require("../services/jwt");

exports.loginValidation = [
    body("email").notEmpty(),
    body("password").notEmpty()
];

/**
 * Login
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const firstError = errors.array()[0];

            throw new ResponseError(firstError.msg)
        }

        const user = await db.User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            throw new ResponseError("Invalid email or password");
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new ResponseError("Invalid email or password");
        }

        const token = signToken(user);

        user.password = undefined;

        res.send({
            message: "You are now logged in",
            data: {
                token,
                user
            }
        });
    } catch (error) {
        logger.error(error.message);

        if (error instanceof ResponseError) {
            res.status(400).send({ message: error.message });
        }

        res.status(500).send({ message: "Internal server error" });
    }
};

/**
 * Verify token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            throw new ResponseError("Invalid token");
        }

        const isValid = isTokenValid(token.split(" ")[1]);

        console.log(token, isValid)

        if (!isValid) {
            throw new ResponseError("Invalid token");
        }

        res.status(200).send({ message: "Token is valid" });

    } catch (error) {
        logger.error(error.message);

        if (error instanceof ResponseError) {
            res.status(400).send({ message: error.message });
        }

        res.status(500).send({ message: "Internal server error" });
    }
}