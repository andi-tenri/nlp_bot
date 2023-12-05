var express = require("express");
var router = express.Router();

router.use('/auth', require('./auth'));
router.use('/dataset', require('./dataset'));
router.use('/product', require('./product'));

module.exports = router;
