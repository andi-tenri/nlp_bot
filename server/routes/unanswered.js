const express = require('express');
const router = express.Router();
const UnansweredController = require('../controllers/unanswered-controller');

router.get('/', UnansweredController.getAll)
router.delete('/:id', UnansweredController.delete)

module.exports = router;