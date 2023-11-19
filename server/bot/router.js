const { Router } = require('pepesan');
const MainControlller = require('./controllers/main-controller');

const router = new Router();

router.keyword("*", [MainControlller, 'index'])

module.exports = router