const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product-controller');
const upload = require('../services/multer');

router.get('/', ProductController.getAll);
router.post('/', upload.single('image'), ProductController.insert);
router.put('/:id', upload.single('image'), ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;  