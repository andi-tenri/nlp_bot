var express = require("express");
var router = express.Router();

router.use('/auth', require('./auth'));
router.use('/dataset', require('./dataset'));

module.exports = router;
