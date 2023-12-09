const express = require('express');
const router = express.Router();
const DatasetController = require('../controllers/dataset-controller');

router.post('/update-intent', DatasetController.updateIntent)
router.post('/delete-intent', DatasetController.deleteIntent)
router.get('/', DatasetController.getAll)
router.post('/', DatasetController.create)
router.get('/unanswered', DatasetController.getUnanswered)
router.put('/:id', DatasetController.update)
router.delete('/:id', DatasetController.delete)
router.post('/refresh-model', DatasetController.refreshModel)

module.exports = router;