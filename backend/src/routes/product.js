
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { verifyToken, checkRole } = require('../middlewares/is-auth');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.post('/', verifyToken, checkRole(['admin', 'mod']), productController.createProduct);


module.exports = router;
